import { Redis } from 'ioredis';
import { nodeId } from '../server';
import Channel from './channel.enum';

export async function ping(redis: Redis): Promise<void> {
  setInterval(() => {
    redis.publish(Channel.ping, nodeId);
  }, 5000);
}
