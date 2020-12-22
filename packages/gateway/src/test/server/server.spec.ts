import { setRouter } from '../../server/router';
import { startServer } from '../../server';
import { config, loadApiDefs } from '@graphql-portal/config';
import setupRedis from '../../redis';
import { Channel } from '@graphql-portal/types';

let app: { use: jest.SpyInstance };
let server: { listen: jest.SpyInstance };
let redis: {
  subscribe: jest.SpyInstance;
  on: jest.SpyInstance;
  emit: (channel: string, ...data: any[]) => Promise<any>;
};

jest.mock('@graphql-portal/logger');
jest.mock('express', () =>
  jest.fn(() => {
    app = { use: jest.fn() };
    return app;
  })
);
jest.mock('http', () => ({
  createServer: jest.fn(() => {
    server = { listen: jest.fn() };
    return server;
  }),
}));
jest.mock('../../redis', () =>
  jest.fn(() => {
    const onHandlers: any = {};
    redis = {
      subscribe: jest.fn(),
      on: jest.fn((event: string, handler: () => any) => {
        if (!onHandlers[event]) {
          onHandlers[event] = [];
        }
        onHandlers[event].push(handler);
      }),
      emit: async (event: string, ...data: any) => {
        await Promise.all(
          onHandlers[event].map((handler: (...args: any[]) => any) => {
            return handler(...data);
          })
        );
      },
    };
    return redis;
  })
);
jest.mock('../../server/router', () => ({
  setRouter: jest.fn(),
}));
jest.mock('@graphql-portal/config', () => ({
  config: {
    apiDefs: 1,
    gateway: {
      use_dashboard_configs: true,
      redis_connection_string: 'redis',
      listen_port: 8080,
      hostname: 'localhost',
    },
    timestamp: Date.now(),
  },
  loadApiDefs: jest.fn(),
}));

describe('Server', () => {
  describe('startServer', () => {
    it('should setup express server and subscribe to api defs updates', async () => {
      await startServer();

      expect(app.use).toHaveBeenCalledTimes(3);
      expect(setRouter).toHaveBeenCalledWith(app, config.apiDefs);
      expect(setupRedis).toHaveBeenCalledWith(config.gateway.redis_connection_string);
      expect(redis.subscribe).toHaveBeenCalledWith(Channel.apiDefsUpdated);
      expect(redis.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(server.listen).toHaveBeenCalledWith(
        config.gateway.listen_port,
        config.gateway.hostname,
        expect.any(Function)
      );

      await redis.emit('message', Channel.apiDefsUpdated, Date.now());
      expect(loadApiDefs).toHaveBeenCalledTimes(1);
      expect(setRouter).toHaveBeenCalledTimes(2);
    });
  });
});
