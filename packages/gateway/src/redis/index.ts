import connect from './connect';
import { ping } from './ping';

export default async function setupRedis(connectionString: string) {
  const subscriber = await connect(connectionString);
  const publisher = await connect(connectionString);
  ping(publisher);
  return subscriber;
}
