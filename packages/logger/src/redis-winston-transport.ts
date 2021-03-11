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

  public constructor(opts: RedisTransportOptions) {
    super(opts);
    this.redis = opts.redis;
    this.metadata = opts.metadata;
    this.expire = opts.expire;
  }

  public async log(info: any, callback: any): Promise<any> {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // merge metadata and log an error
    const logEntry = { ...this.metadata, ...info };
    const key = `logs:${this.metadata.nodeId}:${this.metadata.hostname}:${+new Date()}`;
    console.log('logging');
    await this.redis.multi().set(key, stringify(logEntry)).expire(key, this.expire).exec(callback);
  }
}
