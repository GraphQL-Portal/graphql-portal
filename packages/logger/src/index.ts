import winston, { format, transports } from 'winston';
import { gray } from 'chalk';

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
export function configureLogger(config: {
  log_level: 'debug' | 'info' | 'warn' | 'error';
  log_format?: 'json' | 'text';
}): void {
  logger.clear();

  logger.add(
    new transports.Console({
      level: config.log_level,
      format: config?.log_format === 'json' ? jsonFormat : consoleFormat,
    })
  );
}

export function prefixLogger(prefix = ''): winston.Logger {
  return logger.child({ prefix });
}
