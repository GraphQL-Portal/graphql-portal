import { GatewayConfig } from '@graphql-portal/types';
import { gray } from 'chalk';
import { Cluster, Redis } from 'ioredis';
import winston, { format, transports } from 'winston';
import { DatadogTransport, DatadogTransportOptions } from './datadog-winston-transport';
import { RedisTransport } from './redis-winston-transport';

const labelPid = { label: `pid: ${process.pid}` };

const consoleFormat: winston.Logform.Format = format.combine(
  format.splat(),
  format.label(labelPid),
  format.timestamp(),
  format.colorize(),
  format.printf((info) => {
    const prefix: string = info.prefix === undefined ? '' : `[${info.prefix}]`;
    return `${gray(info.timestamp)} ${gray(info.label)} ${prefix} ${info.level}: ${info.message}`;
  })
);

const jsonFormat: winston.Logform.Format = format.combine(
  format.splat(),
  format.label(labelPid),
  format.timestamp(),
  format.json()
);

const filterFormat = (regex: RegExp) =>
  winston.format((info) => {
    if (info.level !== 'debug') {
      return info;
    }
    if (regex.test(info.prefix)) {
      return info;
    }
    return false;
  })();

function createLogger(): winston.Logger {
  return winston.createLogger({
    transports: [
      new transports.Console({
        level: 'info',
        format: consoleFormat,
      }),
    ],
  });
}

export const logger: winston.Logger = createLogger();

/* eslint-disable camelcase */
/**
 * Configures logger transports.
 * Winston.transports.Console is always on.
 */
export async function configureLogger(
  { log_format, log_level, datadog_logging, hostname, redis_logging, log_filter }: GatewayConfig,
  nodeId: string,
  redis?: Redis | Cluster
): Promise<void> {
  logger.clear();

  let format = log_format === 'json' ? jsonFormat : consoleFormat;
  if (log_filter) {
    try {
      const regex = new RegExp(log_filter);
      if (regex) {
        format = winston.format.combine(filterFormat(regex), format);
      }
    } catch (error) {
      logger.warn(`log_filter is not set: ${error.message}`);
    }
  }

  // Add Console Transport. Always on.
  logger.add(
    new transports.Console({
      level: log_level,
      format,
    })
  );

  // Datadog Transport
  if (datadog_logging?.enabled) {
    const opts: DatadogTransportOptions = datadog_logging;
    opts.metadata = {
      ddsource: 'graphql-portal',
      service: 'gateway',
      hostname,
      nodeId,
    };

    if (datadog_logging.environment) opts.metadata.environment = datadog_logging.environment;

    logger.add(new DatadogTransport(opts));
  }

  if (redis_logging?.enabled && redis) {
    logger.add(
      new RedisTransport({
        redis,
        expire: redis_logging.expire,
        metadata: {
          nodeId,
          hostname,
        },
      })
    );
  }
}

/**
 * Creates a prefixed logger -> [{prefix}] {message}
 * @param prefix
 */
export function prefixLogger(prefix = ''): winston.Logger {
  return logger.child({ prefix });
}
