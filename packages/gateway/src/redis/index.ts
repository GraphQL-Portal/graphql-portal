// import cluster from 'cluster';
import { prefixLogger } from '@graphql-portal/logger';
import IORedis, { Cluster } from 'ioredis';
import connect from './connect';
import { ping } from './ping';
import RedisConnectionOptions from './redis-connection.interface';

const logger = prefixLogger('redis');

export let redisSubscriber: IORedis.Redis | Cluster;
export let redis: IORedis.Redis | Cluster;

export default async function setupRedis(
  options: RedisConnectionOptions,
  connectionString?: string
): Promise<IORedis.Redis | Cluster> {
  redisSubscriber = await connect(options, connectionString);
  redis = await connect(options, connectionString);

  const redisConnectionString = connectionString || options.connection_string;
  if (redisConnectionString) {
    logger.info('Connected to Redis at ➜ %s', redisConnectionString);
  } else {
    logger.info('Connected to Redis Cluster');
    logger.info('Cluster nodes: ');
    for (const node of options.cluster_nodes!) {
      logger.info(`  ${node}`);
    }
  }
  // if (cluster.isMaster)
  ping(redis);
  return redisSubscriber;
}
