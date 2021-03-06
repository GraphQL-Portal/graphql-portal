import * as logger from '../index';
import { GatewayConfig } from '@graphql-portal/types';
import { Redis } from 'ioredis';

jest.mock('@graphql-portal/logger/src/redis-winston-transport.ts', () => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const TransportStream = require('winston-transport');
  class RedisTransport extends TransportStream {}
  RedisTransport.prototype.log = jest.fn();
  return {
    RedisTransport,
  };
});

describe('logger', () => {
  describe('configureLogger', () => {
    const baseConfig: GatewayConfig = {
      hostname: 'localhost',
      listen_port: 8080,
      log_level: 'debug',
      log_format: 'text',
      use_dashboard_configs: true,
      dashboard_config: {
        connection_string: 'http://localhost:80',
        secret: '123',
      },
      enable_control_api: false,
      redis: { connection_string: 'redis://localhost:6379', is_cluster: false },
    };

    it('should always enable console logging', async () => {
      const loggerClearSpy = jest.spyOn(logger.logger, 'clear');
      const loggerAddSpy = jest.spyOn(logger.logger, 'add');

      await logger.configureLogger(baseConfig, '1');
      expect(loggerClearSpy).toHaveBeenCalledTimes(1);
      expect(loggerAddSpy).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
    });

    it('should add Datadog and Redis transport if it is enabled in config', async () => {
      const loggerClearSpy = jest.spyOn(logger.logger, 'clear');
      const loggerAddSpy = jest.spyOn(logger.logger, 'add');

      await logger.configureLogger(
        {
          ...baseConfig,
          datadog_logging: {
            enabled: true,
            apiKey: '123',
          },
          redis_logging: {
            enabled: true,
            expire: 10,
          },
        },
        '1',
        {} as Redis
      );
      expect(loggerClearSpy).toHaveBeenCalledTimes(1);
      expect(loggerAddSpy).toHaveBeenCalledTimes(3);

      jest.clearAllMocks();
    });
  });
});
