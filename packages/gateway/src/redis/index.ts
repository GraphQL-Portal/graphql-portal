import { config } from '@graphql-portal/config';
import IORedis from 'ioredis';
import connect from './connect';
import { ping } from './ping';

let redis: IORedis.Redis;

export const getRedisClient = async (connectionString: string = config.gateway.redis_connection_string) => {
  if (redis) return redis;

  return (redis = await connect(connectionString));
};

export default async function setupRedis(connectionString: string) {
  const subscriber = await connect(connectionString);
  const publisher = await connect(connectionString);
  ping(publisher);
  return subscriber;
}
