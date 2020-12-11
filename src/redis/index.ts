import Redis, { Redis as IRedis } from 'ioredis';
import logger from '../logger';

export default async function redisConnect(connectionString: string): Promise<IRedis> {
  const redis = new Redis(connectionString);
  await new Promise((resolve, reject) => {
    redis.on('error', (e) => {
      redis.disconnect();
      logger.error(`Couldn't connect to redis: ${connectionString}`);
      reject(e);
    });
    redis.on('connect', resolve);
  });
  return redis;
}
