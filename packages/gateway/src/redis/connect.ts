import { prefixLogger } from '@graphql-portal/logger';
import RedisConnectionOptions from './redis-connection.interface';
import Redis, { Redis as IRedis, Cluster } from 'ioredis';

const logger = prefixLogger('redis');

// TODO: add support for cluster & sentinel modes
export default async function redisConnect(
  options: RedisConnectionOptions,
  connectionString?: string
): Promise<IRedis | Cluster> {
  let redis: IRedis | Cluster;
  if (connectionString) {
    logger.warn('redis_connection_string is deprecated. Use redis.connection_string instead.');
  }
  if (connectionString || options?.connection_string) {
    redis = new Redis(connectionString || options?.connection_string);
  } else if (options?.is_cluster && options?.cluster_nodes?.length) {
    redis = new Redis.Cluster(options?.cluster_nodes);
  } else {
    return Promise.reject(new Error('Redis connection string was not provided'));
  }

  await new Promise((resolve, reject) => {
    redis.on('error', (e) => {
      redis.disconnect();
      logger.error(`Couldn't connect to redis. Options: ${JSON.stringify(options)}`);
      reject(e);
    });
    redis.on('connect', resolve);
  });
  return redis;
}
