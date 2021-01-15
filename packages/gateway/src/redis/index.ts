import IORedis from 'ioredis';
import connect from './connect';
import { ping } from './ping';

export let redis: IORedis.Redis;

export default async function setupRedis(connectionString: string) {
  redis = await connect(connectionString);
  const publisher = await connect(connectionString);
  ping(publisher);
  return redis;
}
