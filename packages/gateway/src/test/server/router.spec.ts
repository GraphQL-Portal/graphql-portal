import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { ApiDef } from '@graphql-portal/types';
import express from 'express';
import { graphqlHandler, playgroundMiddlewareFactory } from '../../server/mesh';
import { GraphQLSchema } from 'graphql';
import supertest from 'supertest';
import subscribeToRequestMetrics from '../../metric/emitter';
import { buildRouter, setRouter } from '../../server/router';
import { enqueuePublishApiDefStatusUpdated } from '../../redis/publish-api-def-status-updated';

jest.mock('../../tracer');
jest.mock('@graphql-portal/config', () => ({
  config: {
    gateway: {
      enable_metrics_recording: true,
    },
  },
}));
jest.mock('@graphql-mesh/config', () => ({
  processConfig: jest.fn(),
}));
jest.mock('../../redis/publish-api-def-status-updated', () => ({
  __esModule: true,
  publishApiDefStatusUpdated: jest.fn(),
  enqueuePublishApiDefStatusUpdated: jest.fn(),
}));
jest.mock('@graphql-mesh/runtime', () => ({
  getMesh: jest.fn().mockImplementation(() => ({
    schema: new GraphQLSchema({}),
    contextBuilder: 'contextBuilder',
  })),
}));
jest.mock('../../server/mesh', () => ({
  graphqlHandler: jest.fn().mockReturnValue((req: any, res: express.Response) => {
    res.end('response');
  }),
  playgroundMiddlewareFactory: jest.fn().mockReturnValue((req: any, res: express.Response) => {
    res.end('response');
  }),
}));
jest.mock('../../metric/emitter', () => ({
  __esModule: true,
  default: jest.fn(),
  metricEmitter: {
    emit: jest.fn(),
  },
}));

describe('Server', () => {
  describe('router', () => {
    const apiDef: ApiDef = {
      sources: [],
      endpoint: '/endpoint',
      playground: true,
    } as any;

    describe('buildRouter', () => {
      it('should return a router function', async () => {
        const result = await buildRouter([]);

        expect(result).toBeInstanceOf(Function);
        expect(result.name).toBe('router');
      });

      it('should use mesh for api endpoint', async () => {
        const result = await buildRouter([apiDef]);

        expect(result.stack.find((layer) => layer.regexp.test(apiDef.endpoint))).toBeDefined();
        expect(processConfig).toHaveBeenCalledTimes(1);
        expect(getMesh).toHaveBeenCalledTimes(1);
        expect(graphqlHandler).toHaveBeenCalledTimes(1);
        expect(playgroundMiddlewareFactory).toHaveBeenCalledTimes(1);
        expect(subscribeToRequestMetrics).toBeCalledTimes(1);
        expect(enqueuePublishApiDefStatusUpdated).toBeCalledTimes(1);
      });
    });

    describe('setRouter', () => {
      const app = express();
      const server = app.listen();

      afterAll(() => server.close());

      it('should set a callable route', async () => {
        await setRouter(app, [apiDef]);

        const response = await supertest(app).post(apiDef.endpoint).send({ query: '{a}' }).expect(200);
        expect(response.text).toBe('response');
      });
    });
  });
});
