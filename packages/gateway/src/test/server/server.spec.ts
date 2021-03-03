import { config } from '@graphql-portal/config';
import { Channel } from '@graphql-portal/types';
import { Redis, Cluster } from 'ioredis';
import { getConfigFromMaster } from '../../ipc/utils';
import { startPeriodicMetricsRecording } from '../../metric';
import setupRedis from '../../redis';
import { startServer } from '../../server';
import { setRouter } from '../../server/router';
import setupControlApi from '../../server/control-api';

let app: { use: jest.SpyInstance; get: jest.SpyInstance; disable: jest.SpyInstance };
let server: { listen: jest.SpyInstance; getConnections: jest.SpyInstance };

jest.mock('express', () =>
  jest.fn(() => {
    app = { use: jest.fn(), get: jest.fn(), disable: jest.fn() };
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
      emit: async (event: string, ...data: any): Promise<void> => {
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
      enable_metrics_recording: true,
      cors: {
        enabled: true,
        origins: ['http://localhost:3000'],
      },
    },
    timestamp: Date.now(),
  },
  loadApiDefs: jest.fn().mockResolvedValue(true),
}));
jest.mock('../../server/control-api/', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('Server', () => {
  let redis: Redis | Cluster;

  beforeAll(async () => {
    redis = await setupRedis({ connection_string: 'string', is_cluster: false });
  });

  describe('startServer', () => {
    it('should setup express server and subscribe to api defs updates', async () => {
      await startServer();

      expect(app.use).toHaveBeenCalledTimes(5);
      expect(app.disable).toHaveBeenCalledTimes(1);
      expect(app.disable).toHaveBeenCalledWith('x-powered-by');
      expect(setRouter).toHaveBeenCalledWith(app, config.apiDefs);
      expect(setupRedis).toHaveBeenCalledWith(config.gateway.redis);
      expect(redis.subscribe).toHaveBeenCalledWith(Channel.apiDefsUpdated);
      expect(redis.on).toHaveBeenCalledWith('message', expect.any(Function));
      expect(setupControlApi).toHaveBeenCalledTimes(0);
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
