import { EventEmitter } from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { config } from '@graphql-portal/config';
import { redis } from '../redis';
import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { getSourceName, serializer, transformResolverData } from './utils';
import { MetricsChannels, PubSubEvents } from '@graphql-portal/types';

const logger = prefixLogger('analytics:metric-emitter');
export const metricEmitter = new EventEmitter();

const lpush = async (key: string, ...args: any[]): Promise<void> => {
  if (!key) return;
  if (Object.values(MetricsChannels).includes(key as MetricsChannels) && !args[0]) return;
  logger.debug(`lpush: ${key}`);
  redis.lpush(key, ...args).catch((error: Error) => {
    logger.error(`Failed to write request data. \n Error: ${error} \n Data: ${args}`);
  });
};

const pubSubListenerWrapper = (emit: (...args: any[]) => any) => {
  return (data: { resolverData: ResolverData }): void => {
    if (!getSourceName(data.resolverData)) return; // do not emit resolver events without sourcename (nested queries)
    emit(data);
  };
};

const subscribe = async (pubsub: MeshPubSub): Promise<void> => {
  if (!metricEmitter.listenerCount(MetricsChannels.GOT_REQUEST)) {
    metricEmitter.on(MetricsChannels.GOT_REQUEST, async (id: string, { query, userAgent, ip, request, date }) => {
      logger.debug(`MetricsChannels.GOT_REQUEST ${id}: ${JSON.stringify(query)}`);
      await lpush(MetricsChannels.REQUEST_IDS, id);
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
      logger.debug(`MetricsChannels.RESOLVER_CALLED: ${JSON.stringify(resolverData)}`);
      lpush(
        resolverData.context.requestId,
        serializer({
          ...transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData),
          info: resolverData.info,
          args: resolverData.args,
        })
      );
    });

    metricEmitter.on(MetricsChannels.RESOLVER_DONE, (resolverData: ResolverData, result: any) => {
      logger.debug(`MetricsChannels.RESOLVER_DONE: ${JSON.stringify(resolverData)}, ${JSON.stringify(result)}`);
      lpush(
        resolverData.context.requestId,
        serializer({
          ...transformResolverData(MetricsChannels.RESOLVER_DONE, resolverData),
          result,
        })
      );
    });

    metricEmitter.on(MetricsChannels.RESOLVER_ERROR, (resolverData: ResolverData, error: Error) => {
      logger.debug(`MetricsChannels.RESOLVER_ERROR: ${JSON.stringify(resolverData)}, ${error}`);
      lpush(
        resolverData.context.requestId,
        serializer({
          ...transformResolverData(MetricsChannels.RESOLVER_ERROR, resolverData),
          error,
        })
      );
    });

    metricEmitter.on(
      MetricsChannels.SENT_RESPONSE,
      (id: string, rawResponseBody: string, contentLength: number, date: number) => {
        logger.debug(`MetricsChannels.SENT_RESPONSE: ${id}, ${contentLength}`);
        lpush(
          id,
          serializer({
            event: MetricsChannels.SENT_RESPONSE,
            rawResponseBody,
            contentLength,
            date,
          })
        );
      }
    );

    metricEmitter.on(MetricsChannels.GOT_ERROR, (id: string, error: Error, date: number) => {
      logger.debug(`MetricsChannels.GOT_ERROR: ${id}, ${error}`);
      lpush(
        id,
        serializer({
          event: MetricsChannels.GOT_ERROR,
          error,
          date,
        })
      );
    });
  }

  await pubsub.subscribe(
    PubSubEvents.RESOLVER_CALLED,
    pubSubListenerWrapper(({ resolverData }) => {
      logger.debug(`PubSubEvents.RESOLVER_CALLED: ${JSON.stringify(resolverData)}`);
      metricEmitter.emit(MetricsChannels.RESOLVER_CALLED, resolverData);
    })
  );
  await pubsub.subscribe(
    PubSubEvents.RESOLVER_DONE,
    pubSubListenerWrapper(({ resolverData, result }) => {
      logger.debug(`PubSubEvents.RESOLVER_DONE: ${JSON.stringify(resolverData)}, ${JSON.stringify(result)}`);
      if (/error/i.test(result?.constructor?.name)) {
        metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, result);
      } else {
        metricEmitter.emit(MetricsChannels.RESOLVER_DONE, resolverData, result);
      }
    })
  );
  await pubsub.subscribe(
    PubSubEvents.RESOLVER_ERROR,
    pubSubListenerWrapper(({ resolverData, error }) => {
      logger.debug(`PubSubEvents.RESOLVER_ERROR: ${JSON.stringify(resolverData)}, ${error}`);
      metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, error);
    })
  );
};

export default subscribe;
