import { EventEmitter } from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { config } from '@graphql-portal/config';
import { redis } from '../redis';
import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { getSourceName, serializer, transformResolverData } from './utils';
import { MetricsChannels, PubSubEvents } from '@graphql-portal/types';

const logger = prefixLogger('analytics:metric-emitter');
export const metricEmitter = new EventEmitter();

const lpush = (key: string, ...args: any[]): Promise<number | void> =>
  redis.lpush(key, ...args).catch((error: Error) => {
    logger.error(`Failed to write request data. \n Error: ${error} \n Data: ${args}`);
  });

const pubSubListenerWrapper = (emit: (...args: any[]) => any) => {
  return (data: { resolverData: ResolverData }) => {
    if (!getSourceName(data.resolverData)) return; // do not emit resolver events without sourcename (nested queries)
    emit(data);
  };
};

const subscribe = async (pubsub: MeshPubSub): Promise<void> => {
  metricEmitter.on(MetricsChannels.GOT_REQUEST, async (id: string, { query, userAgent, ip, request }) => {
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
          date: Date.now(),
        },
        ['parser', 'res', '_']
      )
    );
  });

  metricEmitter.on(MetricsChannels.RESOLVER_CALLED, (resolverData: ResolverData) =>
    lpush(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData),
        info: resolverData.info,
        args: resolverData.args,
      })
    )
  );

  metricEmitter.on(MetricsChannels.RESOLVER_DONE, (resolverData: ResolverData, result: any) =>
    lpush(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_DONE, resolverData),
        result,
      })
    )
  );

  metricEmitter.on(MetricsChannels.RESOLVER_ERROR, (resolverData: ResolverData, error: Error) =>
    lpush(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_ERROR, resolverData),
        error,
      })
    )
  );

  metricEmitter.on(MetricsChannels.SENT_RESPONSE, (id: string, rawResponseBody: string, contentLength: number) =>
    lpush(
      id,
      serializer({
        event: MetricsChannels.SENT_RESPONSE,
        rawResponseBody,
        contentLength,
        date: Date.now(),
      })
    )
  );

  metricEmitter.on(MetricsChannels.GOT_ERROR, (id: string, error: Error) =>
    lpush(
      id,
      serializer({
        event: MetricsChannels.GOT_ERROR,
        error,
        date: Date.now(),
      })
    )
  );

  await pubsub.subscribe(
    PubSubEvents.RESOLVER_CALLED,
    pubSubListenerWrapper(({ resolverData }) => {
      resolverData.context.tracerSpan.setTag('graphql.fieldName', resolverData.info?.fieldName);
      resolverData.context.tracerSpan.setTag('graphql.returnType', resolverData.info?.returnType.toString());
      resolverData.context.tracerSpan.setTag('graphql.parentType', resolverData.info?.parentType.toString());
      metricEmitter.emit(MetricsChannels.RESOLVER_CALLED, resolverData);
    })
  );
  await pubsub.subscribe(
    PubSubEvents.RESOLVER_DONE,
    pubSubListenerWrapper(({ resolverData, result }) => {
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
      metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, error);
    })
  );
};

export default subscribe;
