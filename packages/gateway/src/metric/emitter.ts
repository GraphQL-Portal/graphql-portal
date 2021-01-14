import { EventEmitter } from 'events';
import { Pipeline } from 'ioredis';
import { prefixLogger } from '@graphql-portal/logger';
import redisConnect from '../redis/connect';
import { nodeId } from '../server/index';
import { MeshPubSub, ResolverData } from '@graphql-mesh/types';
import { serializer, transformResolverData } from './utils';
import MetricsChannels from './channels.enum';

const logger = prefixLogger('metric-emitter');
export const metricEmitter = new EventEmitter();

const subscribe = async (redisConnectionString: string, pubsub: MeshPubSub): Promise<void> => {
  const redis = await redisConnect(redisConnectionString);
  let multi: Pipeline;

  metricEmitter.on(MetricsChannels.GOT_REQUEST, (id: string, { query, userAgent, ip, request }) => {
    multi = redis.multi().lpush(
      id,
      serializer(
        {
          event: MetricsChannels.GOT_REQUEST,
          nodeId,
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

  metricEmitter.on(MetricsChannels.RESOLVER_CALLED, (resolverData: ResolverData) => {
    multi = multi.lpush(
      resolverData.context.requestId,
      serializer(transformResolverData(MetricsChannels.RESOLVER_CALLED, resolverData))
    );
  });

  metricEmitter.on(MetricsChannels.RESOLVER_DONE, (resolverData: ResolverData, result: any) => {
    multi = multi.lpush(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_DONE, resolverData),
        result,
      })
    );
  });

  metricEmitter.on(MetricsChannels.RESOLVER_ERROR, (resolverData: ResolverData, error: Error) => {
    multi = multi.lpush(
      resolverData.context.requestId,
      serializer({
        ...transformResolverData(MetricsChannels.RESOLVER_ERROR, resolverData),
        error,
      })
    );
  });

  metricEmitter.on(
    MetricsChannels.SENT_RESPONSE,
    (id: string, rawResponseBody: string, contentLength: number, error: Error) => {
      multi
        .lpush(MetricsChannels.REQUEST_IDS, id)
        .lpush(
          id,
          serializer({
            event: MetricsChannels.SENT_RESPONSE,
            rawResponseBody,
            contentLength,
            error,
            date: Date.now(),
          })
        )
        .exec()
        .catch((error) => logger.error(`Failed to write request data to redis. Error: ${error}`));
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
