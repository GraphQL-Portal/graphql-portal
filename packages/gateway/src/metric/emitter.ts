import { EventEmitter } from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { config } from '@graphql-portal/config';
import { redis } from '../redis';
import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { serializer, transformResolverData } from './utils';
import MetricsChannels from './channels.enum';
import PubSubEventsEnum from './pubsub-events.enum';

const logger = prefixLogger('analytics:metric-emitter');
export const metricEmitter = new EventEmitter();

const lpush = (key: string, ...args: any[]): Promise<number | void> =>
  redis.lpush(key, ...args).catch((error: Error) => {
    logger.error(`Failed to write request data. \n Error: ${error} \n Data: ${args}`);
  });

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
      serializer(transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData))
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

  await pubsub.subscribe(PubSubEventsEnum.RESOLVER_CALLED, ({ resolverData }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_CALLED, resolverData);
  });
  await pubsub.subscribe(PubSubEventsEnum.RESOLVER_DONE, ({ resolverData, result }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_DONE, resolverData, result);
  });
  await pubsub.subscribe(PubSubEventsEnum.RESOLVER_ERROR, ({ resolverData, error }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, error);
  });
};

export default subscribe;
