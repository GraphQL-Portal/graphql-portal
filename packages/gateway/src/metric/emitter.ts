import { EventEmitter } from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { config } from '@graphql-portal/config';
import redisConnect from '../redis/connect';
import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { serializer, transformResolverData } from './utils';
import MetricsChannels from './channels.enum';

const logger = prefixLogger('metric-emitter');
export const metricEmitter = new EventEmitter();

const subscribe = async (redisConnectionString: string, pubsub: MeshPubSub): Promise<void> => {
  const redis = await redisConnect(redisConnectionString);

  const pushWithErrorHandle = (key: string, ...args: any[]): Promise<number | void> => {
    return redis.lpush(key, ...args).catch((error) => {
      logger.error(`Failed to write request data. \n Error: ${error} \n Data: ${args}`);
    });
  };

  metricEmitter.on(MetricsChannels.GOT_REQUEST, async (id: string, { query, userAgent, ip, request }) => {
    await pushWithErrorHandle(
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

  metricEmitter.on(MetricsChannels.RESOLVER_CALLED, async (resolverData: ResolverData) => {
    await pushWithErrorHandle(
      resolverData.context.requestId,
      serializer(transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData))
    );
  });

  metricEmitter.on(MetricsChannels.RESOLVER_DONE, async (resolverData: ResolverData, result: any) => {
    await pushWithErrorHandle(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_DONE, resolverData),
        result,
      })
    );
  });

  metricEmitter.on(MetricsChannels.RESOLVER_ERROR, async (resolverData: ResolverData, error: Error) => {
    await pushWithErrorHandle(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_ERROR, resolverData),
        error,
      })
    );
  });

  metricEmitter.on(
    MetricsChannels.SENT_RESPONSE,
    async (id: string, rawResponseBody: string, contentLength: number, error: Error) => {
      await pushWithErrorHandle(MetricsChannels.REQUEST_IDS, id);
      await pushWithErrorHandle(
        id,
        serializer({
          event: MetricsChannels.SENT_RESPONSE,
          rawResponseBody,
          contentLength,
          error,
          date: Date.now(),
        })
      );
    }
  );

  await pubsub.subscribe('resolverCalled', ({ resolverData }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_CALLED, resolverData);
  });
  await pubsub.subscribe('resolverDone', ({ resolverData, result }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_DONE, resolverData, result);
  });
  await pubsub.subscribe('resolverError', ({ resolverData, error }) => {
    metricEmitter.emit(MetricsChannels.RESOLVER_ERROR, resolverData, error);
  });
};

export default subscribe;
