import { config } from '@graphql-portal/config';
import { Channel } from '@graphql-portal/types';
import { Redis } from 'ioredis';
import { nodeId } from '../server';
import * as os from 'os';

export async function ping(redis: Redis): Promise<void> {
  setInterval(() => {
    redis.publish(Channel.ping, JSON.stringify({ nodeId, configTimestamp: config.timestamp, hostname: os.hostname() }));
  }, 5000);
}
