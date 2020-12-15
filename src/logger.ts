import winston, { format, transports } from 'winston';
import { GatewayConfig } from './types/gateway-config';

const consoleFormat: winston.Logform.Format = format.combine(
  format.timestamp(),
  format.colorize(),
  format.printf((info) => {
    const prefix: string = info.prefix === undefined ? '' : `[${info.prefix}]`;
    return `${info.timestamp} ${prefix} ${info.level}: ${info.message}`;
  })
);

export let logger: winston.Logger = createLogger();

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

export function configureLogger(config: GatewayConfig): void {
  // TODO: we'll be adding other transports and formats later
  logger.clear();
  logger.add(
    new transports.Console({
      level: config.log_level,
      format: consoleFormat,
    })
  );
}

export function prefixLogger(prefix: string = ''): winston.Logger {
  return logger.child({ prefix });
}
