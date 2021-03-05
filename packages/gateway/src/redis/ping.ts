import { config } from '@graphql-portal/config';
import { Channel } from '@graphql-portal/types';
import { Redis, Cluster } from 'ioredis';
import * as os from 'os';

export async function ping(redis: Redis | Cluster): Promise<void> {
  setInterval(() => {
    redis.publish(
      Channel.ping,
      JSON.stringify({
        nodeId: config.nodeId,
        configTimestamp: config.timestamp,
        hostname: os.hostname(),
        listenHostname: config.gateway.hostname,
        listenPort: config.gateway.listen_port,
        servername: config.gateway.servername,
      })
    );
  }, 5000);
}
