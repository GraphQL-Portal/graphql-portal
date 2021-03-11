import stringify from 'fast-safe-stringify';
import TransportStream from 'winston-transport';
import { Redis, Cluster } from 'ioredis';

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
  private readonly expire: number;

  /**
   * Constructor function for Redis Transport.
   * @param {RedisTransportOptions} opts - Redis options
   */
  public constructor(opts: RedisTransportOptions) {
    super(opts);
    this.redis = opts.redis;
    this.metadata = opts.metadata;
    this.expire = opts.expire;
  }

  public log(info: any, callback: any): void {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const logEntry = { ...this.metadata, ...info };
    const key = `logs:${this.metadata.nodeId}:${this.metadata.hostname}:${+new Date()}`;
    this.redis.multi().set(key, stringify(logEntry)).expire(key, this.expire).exec(callback);
  }
}
