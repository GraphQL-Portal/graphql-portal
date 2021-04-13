import stringify from 'fast-safe-stringify';
import TransportStream from 'winston-transport';
import { Redis, Cluster } from 'ioredis';
import { Channel } from '@graphql-portal/types';

export interface RedisOptions {
  redis: Redis | Cluster;
  expire: number;
  metadata: {
    nodeId: string;
    hostname: string;
    [key: string]: unknown;
  };
}

export type RedisTransportOptions = RedisOptions & TransportStream.TransportStreamOptions;
/**
 * Transport for outputting to Redis.
 */
export class RedisTransport extends TransportStream {
  private readonly metadata: {
    nodeId: string;
    hostname: string;
    [key: string]: unknown;
  };

  private readonly redis: Redis | Cluster;
  private interval: NodeJS.Timer;

  /**
   * Constructor function for Redis Transport.
   * @param {RedisTransportOptions} opts - Redis options
   */
  public constructor(opts: RedisTransportOptions) {
    super(opts);
    this.redis = opts.redis;
    this.metadata = opts.metadata;
    this.startRemovingExpiredLogs(opts.expire);
  }

  public log(info: any, callback: any): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const timestamp = +new Date();
    const logEntry = stringify({ ...this.metadata, ...info, timestamp });
    this.redis
      .zadd(Channel.recentLogs, timestamp, logEntry)
      .then(() => callback())
      .catch(() => callback());
  }

  private startRemovingExpiredLogs(expirationTime: number): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const expirationTimeInMs = expirationTime * 1000;
    this.interval = setInterval(async () => {
      await this.redis.zremrangebyscore(Channel.recentLogs, 0, +new Date() - expirationTimeInMs);
    }, expirationTimeInMs);
  }
}
