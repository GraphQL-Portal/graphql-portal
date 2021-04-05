console.log('EXPORTING LOGGER/INDEX');
export { RedisTransport } from './src/redis-winston-transport';
export const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};
export const prefixLogger = jest.fn().mockReturnValue(logger);
