import cluster from 'cluster';
import { prefixLogger } from '@graphql-portal/logger';
import IORedis, { Cluster } from 'ioredis';
import connect from './connect';
import { ping } from './ping';
import RedisConnectionOptions from './redis-connection.interface';

const logger = prefixLogger('redis');

export let redisSubscriber: IORedis.Redis | Cluster;
export let redis: IORedis.Redis | Cluster;

export default async function setupRedis(options: RedisConnectionOptions): Promise<IORedis.Redis | Cluster> {
  redisSubscriber = await connect(options);
  redis = await connect(options);

  logger.info('Connected to Redis at ➜ %s', options);
  if (cluster.isMaster) ping(redis);
  return redisSubscriber;
}
