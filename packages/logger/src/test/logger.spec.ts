import * as logger from '../index';
import { GatewayConfig } from '@graphql-portal/types';

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

    it('should always enable console logging', () => {
      const loggerClearSpy = jest.spyOn(logger.logger, 'clear');
      const loggerAddSpy = jest.spyOn(logger.logger, 'add');

      logger.configureLogger(baseConfig);
      expect(loggerClearSpy).toHaveBeenCalledTimes(1);
      expect(loggerAddSpy).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
    });

    it('should add Datadog transport if it is enabled in config', () => {
      const loggerClearSpy = jest.spyOn(logger.logger, 'clear');
      const loggerAddSpy = jest.spyOn(logger.logger, 'add');

      logger.configureLogger({
        ...baseConfig,
        datadog_logging: {
          enabled: true,
          apiKey: '123',
        },
      });
      expect(loggerClearSpy).toHaveBeenCalledTimes(1);
      expect(loggerAddSpy).toHaveBeenCalledTimes(2);

      jest.clearAllMocks();
    });
  });
});
