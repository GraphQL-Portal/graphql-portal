import { prefixLogger } from '@graphql-portal/logger';
import IORedis from 'ioredis';
import connect from './connect';
import { ping } from './ping';

const logger = prefixLogger('redis');

export let redisSubscriber: IORedis.Redis;
export let redis: IORedis.Redis;

export default async function setupRedis(connectionString: string): Promise<IORedis.Redis> {
  redisSubscriber = await connect(connectionString);
  redis = await connect(connectionString);

  logger.info('Connected to Redis at ➜ %s', connectionString);
  ping(redis);
  return redisSubscriber;
}
