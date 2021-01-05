import { buildRouter, setRouter } from '../../server/router';
import { processConfig } from '@graphql-mesh/config';
import { getMesh } from '@graphql-mesh/runtime';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';
import { ApiDef } from '@graphql-portal/types';
import supertest from 'supertest';

jest.mock('@graphql-portal/logger', () => ({
  prefixLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }),
}));
jest.mock('@graphql-portal/config', () => ({
  config: {
    gateway: {},
  },
}));
jest.mock('@graphql-mesh/config', () => ({
  processConfig: jest.fn(),
}));
jest.mock('@graphql-mesh/runtime', () => ({
  getMesh: jest.fn().mockReturnValue({ schema: 'schema', contextBuilder: 'contextBuilder' }),
}));
jest.mock('express-graphql', () => ({
  graphqlHTTP: jest.fn().mockReturnValue((req: any, res: express.Response) => {
    res.end('response');
  }),
}));

describe('Server', () => {
  describe('router', () => {
    const apiDef: ApiDef = {
      sources: [],
      endpoint: '/endpoint',
    } as any;

    describe('buildRouter', () => {
      it('should return a router function', async () => {
        const result = await buildRouter([]);

        expect(result).toBeInstanceOf(Function);
        expect(result.name).toBe('router');
      });

      it('should use mesh for api endpoint', async () => {
        const result = await buildRouter([apiDef]);

        expect(result.stack.find((layer) => layer.regexp.test(apiDef.endpoint))).toBeDefined;
        expect(processConfig).toHaveBeenCalledTimes(1);
        expect(getMesh).toHaveBeenCalledTimes(1);
        expect(graphqlHTTP).toHaveBeenCalledTimes(1);
      });
    });

    describe('setRouter', () => {
      const app = express();
      const server = app.listen();

      afterAll(() => server.close());

      it('should set a callable route', async () => {
        await setRouter(app, [apiDef]);

        const response = await supertest(app).post(apiDef.endpoint).expect(200);
        expect(response.text).toBe('response');
      });
    });
  });
});
