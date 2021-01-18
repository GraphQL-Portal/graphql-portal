import { logger } from '@graphql-portal/logger';
import IORedis from 'ioredis';
import connect from './connect';
import { ping } from './ping';

export let redisSubscriber: IORedis.Redis;
export let redis: IORedis.Redis;

export default async function setupRedis(connectionString: string) {
  redisSubscriber = await connect(connectionString);
  redis = await connect(connectionString);

  logger.info('Connected to Redis at ➜ %s', connectionString);
  ping(redis);
  return redisSubscriber;
}
