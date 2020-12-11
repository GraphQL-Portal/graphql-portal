import winston, { format, transports } from 'winston';

export function prefixLogger(prefix: string = ''): winston.Logger {
  const prefixStr: string = prefix.length > 0 ? `[${prefix}]` : '';
  return winston.createLogger({
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.printf((info) => `${info.timestamp} ${prefixStr} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
}

const logger = prefixLogger();

export default logger;
