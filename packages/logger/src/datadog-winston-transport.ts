import * as tls from 'tls';
import stringify from 'fast-safe-stringify';
import TransportStream from 'winston-transport';

export interface DatadogOptions {
  host?: string;
  port?: number;
  apiKey: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export type DatadogTransportOptions = DatadogOptions & TransportStream.TransportStreamOptions;

const setupListeners = (socket: tls.TLSSocket): Promise<void> =>
  new Promise((resolve, reject) => {
    socket.on('secureConnect', resolve).on('error', reject).on('timeout', reject);
  });

/**
 * Transport for outputting to DataDog TCP (TLS) intake. By default will use the US server.
 */
export class DatadogTransport extends TransportStream {
  private readonly metadata: Record<string, unknown>;
  private readonly config: DatadogOptions;

  /**
   * Constructor function for Datadog Transport.
   * @param {DatadogTransportOptions} opts - Datadog options
   */
  public constructor(opts: DatadogTransportOptions) {
    super(opts);

    this.config = {
      apiKey: opts.apiKey,
      host: opts.host || 'intake.logs.datadoghq.com',
      port: opts.port || 10516,
      tags: opts.tags || [],
    };

    this.metadata = {};
    if (opts.metadata) {
      Object.assign(this.metadata, opts.metadata);
    }

    // add custom tags
    if (this.config.tags) {
      this.metadata.ddtags = this.config.tags.join(',');
    }
  }

  public async log(info: any, callback: any): Promise<any> {
    setImmediate(() => {
      this.emit('logged', info);
    });

    const socket = tls.connect(this.config.port!, this.config.host);
    try {
      await setupListeners(socket);
    } catch (e) {
      return callback(e);
    }

    if (!socket.authorized) {
      // eslint-disable-next-line node/no-callback-literal
      return callback('Error connecting to Datadog');
    }

    // merge metadata and log an error
    const logEntry = { ...this.metadata, ...info };
    socket.write(`${this.config.apiKey} ${stringify(logEntry)}\r\n`, () => {
      socket.end();

      return callback();
    });
  }
}
