import { Redis } from 'ioredis';
import { nodeId } from '../server';
import Channel from './channel.enum';
import { config } from '@graphql-portal/config';

export async function ping(redis: Redis): Promise<void> {
  setInterval(() => {
    redis.publish(Channel.ping, JSON.stringify({ nodeId, configTimestamp: config.timestamp }));
  }, 5000);
}
