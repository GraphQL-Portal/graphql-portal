import { prefixLogger } from '@graphql-portal/logger';
import RedisConnectionOptions from './redis-connection.interface';
import Redis, { Redis as IRedis, Cluster } from 'ioredis';

const logger = prefixLogger('redis');

// TODO: add support for cluster & sentinel modes
export default async function redisConnect(options: RedisConnectionOptions): Promise<IRedis | Cluster> {
  const redis =
    options.is_cluster && options.cluster_nodes?.length
      ? new Redis.Cluster(options.cluster_nodes)
      : new Redis(options.connection_string);

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
