import { config } from '@graphql-portal/config';
import { Channel } from '@graphql-portal/types';
import { Redis } from 'ioredis';
import { getConfigFromMaster } from '../../ipc/utils';
import { startPeriodicMetricsRecording } from '../../metric';
import setupRedis from '../../redis';
import { startServer } from '../../server';
import { setRouter } from '../../server/router';

let app: { use: jest.SpyInstance };
let server: { listen: jest.SpyInstance; getConnections: jest.SpyInstance };

jest.mock('../../tracer');

jest.mock('express', () =>
  jest.fn(() => {
    app = { use: jest.fn() };
    return app;
  })
);
jest.mock('http', () => ({
  createServer: jest.fn(() => {
    server = { listen: jest.fn(), getConnections: jest.fn() };
    return server;
  }),
}));
jest.mock(
  '../../redis',
  jest.fn(() => {
    const onHandlers: any = {};
    const redis = {
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

    return {
      __esModule: true,
      default: jest.fn(() => redis),
    };
  })
);
jest.mock('../../metric', () => {
  return {
    startPeriodicMetricsRecording: jest.fn(),
  };
});
jest.mock('../../ipc/utils', () => {
  const utils = jest.requireActual('../../ipc/utils');
  return {
    ...utils,
    getConfigFromMaster: jest.fn().mockResolvedValue({ loaded: true }),
  };
});
jest.mock('../../server/router', () => ({
  setRouter: jest.fn(),
}));
jest.mock('@graphql-portal/config', () => ({
  config: {
    apiDefs: [],
    gateway: {
      use_dashboard_configs: true,
      redis_connection_string: 'redis',
      listen_port: 8080,
      hostname: 'localhost',
      metrics: {
        enabled: true,
      },
    },
    timestamp: Date.now(),
  },
  loadApiDefs: jest.fn().mockResolvedValue(true),
}));

describe('Server', () => {
  let redis: Redis;

  beforeAll(async () => {
    redis = await setupRedis('string');
  });

  describe('startServer', () => {
    it('should setup express server and subscribe to api defs updates', async () => {
      await startServer();

      expect(app.use).toHaveBeenCalledTimes(4);
      expect(setRouter).toHaveBeenCalledWith(app, config.apiDefs);
      expect(setupRedis).toHaveBeenCalledWith(config.gateway.redis_connection_string);
      expect(redis.subscribe).toHaveBeenCalledWith(Channel.apiDefsUpdated);
      expect(redis.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(server.listen).toHaveBeenCalledWith(
        config.gateway.listen_port,
        config.gateway.hostname,
        expect.any(Function)
      );
      expect(startPeriodicMetricsRecording).toHaveBeenCalledTimes(1);

      await redis.emit('message', Channel.apiDefsUpdated, Date.now());
      expect(getConfigFromMaster).toHaveBeenCalledTimes(1);
      expect(setRouter).toHaveBeenCalledTimes(2);
    });
  });
});
