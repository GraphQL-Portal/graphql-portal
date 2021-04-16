import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { MetricsChannels, PubSubEvents } from '@graphql-portal/types';
import { EventEmitter } from 'events';
import { redis } from '../redis';
import { Context } from '../server';
import { tracer } from '../tracer';
import { getSourceName, reducePath, serializer, transformResolverData } from './utils';

const logger = prefixLogger('analytics:metric-emitter');
export const metricEmitter = new EventEmitter();

type ResolverDataWithContext = ResolverData<any, any, Context, any>;

const lpush = async (key: string, ...args: any[]): Promise<void> => {
  if (!key) return;
  if (Object.values(MetricsChannels).includes(key as MetricsChannels) && !args[0]) return;
  logger.debug(`lpush: ${key}`);
  redis.lpush(key, ...args).catch((error: Error) => {
    logger.error(`Failed to write request data. \n Error: ${error} \n Data: ${args}`);
  });
};

const pubSubListenerWrapper = (emit: (...args: any[]) => any) => {
  return (data: { resolverData: ResolverDataWithContext }): void => {
    if (!getSourceName(data.resolverData)) return; // do not emit resolver events without sourcename (nested queries)
    emit(data);
  };
};

const traceResolverStart = (resolverData: ResolverDataWithContext): void => {
  if (!tracer) return;
  const fieldPath = reducePath(resolverData.info?.path);
  if (!fieldPath) return;
  const resolverSpan = tracer.startSpan(`resolver of ${fieldPath}`, { childOf: resolverData.context!.tracerSpan });
  resolverData.context!.resolverSpans[fieldPath] = resolverSpan;
};

const traceResolverFinish = (error: Error | null, resolverData: ResolverDataWithContext): void => {
  if (!tracer) return;
  const fieldPath = reducePath(resolverData.info?.path);
  if (!fieldPath) return;
  const resolverSpan = resolverData.context!.resolverSpans[fieldPath];
  if (!resolverSpan) return;
  if (error) {
    resolverSpan.log({ error });
  }
  resolverSpan.finish();
};

const subscribe = async (pubsub: MeshPubSub): Promise<void> => {
  if (!metricEmitter.listenerCount(MetricsChannels.GOT_REQUEST)) {
    metricEmitter.on(MetricsChannels.GOT_REQUEST, async (id: string, { query, userAgent, ip, request, date }) => {
      logger.debug(`MetricsChannels.GOT_REQUEST ${id}: ${JSON.stringify(query)}`);
      await lpush(
        id,
        serializer(
          {
            event: MetricsChannels.GOT_REQUEST,
            nodeId: config.nodeId,
            query,
            userAgent,
            ip,
            request,
            date,
          },
          ['parser', 'res', '_']
        )
      );
    });

    metricEmitter.on(MetricsChannels.RESOLVER_CALLED, (resolverData: ResolverData) => {
      const data = serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData),
        info: resolverData.info,
        args: resolverData.args,
      });
      logger.debug(`MetricsChannels.RESOLVER_CALLED: ${data}`);
      lpush(resolverData.context.requestId, data);
    });

    metricEmitter.on(MetricsChannels.RESOLVER_DONE, (resolverData: ResolverData, result: any) => {
      const data = serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_DONE, resolverData),
        result,
      });
      logger.debug(`MetricsChannels.RESOLVER_DONE: ${data}`);
      lpush(resolverData.context.requestId, data);
    });

    metricEmitter.on(MetricsChannels.RESOLVER_ERROR, (resolverData: ResolverData, error: Error) => {
      const data = serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_ERROR, resolverData),
        error,
      });
      logger.debug(`MetricsChannels.RESOLVER_ERROR: ${data}`);
      lpush(resolverData.context.requestId, data);
    });

    metricEmitter.on(
      MetricsChannels.SENT_RESPONSE,
      async (id: string, rawResponseBody: string, contentLength: number, date: number) => {
        logger.debug(`MetricsChannels.SENT_RESPONSE: ${id}, ${contentLength}`);
        await lpush(
          id,
          serializer({
            event: MetricsChannels.SENT_RESPONSE,
            rawResponseBody,
            contentLength,
            date,
          })
        );
        await lpush(MetricsChannels.REQUEST_IDS, id);
      }
    );

    metricEmitter.on(MetricsChannels.GOT_ERROR, async (id: string, error: Error, date: number) => {
      logger.debug(`MetricsChannels.GOT_ERROR: ${id}, ${error.toString().split('\n')[0]}`);
      await lpush(
        id,
        serializer({
          event: MetricsChannels.GOT_ERROR,
          error,
          date,
        })
      );
      await lpush(MetricsChannels.REQUEST_IDS, id);
    });
  }

  await pubsub.subscribe(
    PubSubEvents.RESOLVER_CALLED,
    pubSubListenerWrapper(({ resolverData }) => {
      logger.debug(`PubSubEvents.RESOLVER_CALLED ${resolverData.context?.id || ''}`);
      metricEmitter.emit(MetricsChannels.RESOLVER_CALLED, resolverData);
      traceResolverStart(resolverData);
    })
  );
  await pubsub.subscribe(
    PubSubEvents.RESOLVER_DONE,
    pubSubListenerWrapper(({ resolverData, result }) => {
      logger.debug(`PubSubEvents.RESOLVER_DONE ${resolverData.context?.id || ''}`);
      if (/error/i.test(result?.constructor?.name)) {
        metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, result);
      } else {
        metricEmitter.emit(MetricsChannels.RESOLVER_DONE, resolverData, result);
      }
      traceResolverFinish(null, resolverData);
    })
  );
  await pubsub.subscribe(
    PubSubEvents.RESOLVER_ERROR,
    pubSubListenerWrapper(({ resolverData, error }) => {
      logger.debug(`PubSubEvents.RESOLVER_ERROR ${resolverData.context?.id || ''}: ${error.message}`);
      metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, error);
      traceResolverFinish(error, resolverData);
    })
  );
};

export default subscribe;
