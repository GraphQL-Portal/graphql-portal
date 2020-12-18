import { config } from '@graphql-portal/config';
import { Channel } from '@graphql-portal/types';
import { Redis } from 'ioredis';
import { nodeId } from '../server';

export async function ping(redis: Redis): Promise<void> {
  setInterval(() => {
    redis.publish(Channel.ping, JSON.stringify({ nodeId, configTimestamp: config.timestamp }));
  }, 5000);
}
