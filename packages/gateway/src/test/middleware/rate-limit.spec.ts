import { ApiDef } from '@graphql-portal/types';
import { NextFunction, Request, Response } from 'express';
import { GraphQLSchema } from 'graphql';
import rateLimit from '../../middleware/graphql-rate-limit/rate-limit';

jest.mock('../../server/router', () => ({
  apiSchema: {
    api: new GraphQLSchema({}),
  },
}));
const saveCostMock = jest.fn();
const getTotalCostMock = jest.fn().mockResolvedValue(1);
jest.mock('../../middleware/graphql-rate-limit/request-cost.tool', () => {
  return jest.fn().mockImplementation(() => ({
    saveCost: saveCostMock,
    getTotalCost: getTotalCostMock,
  }));
});

describe('Rate limit MW', () => {
  const request = {
    method: 'POST',
    body: { query: '{a}' },
  } as Request;
  const response = ({
    status: jest.fn(),
    json: jest.fn(),
  } as any) as Response;
  const next: NextFunction = jest.fn();

  it('should save cost and call next', async () => {
    const expressMw = rateLimit({ name: 'api', rate_limit: { complexity: 100 } } as ApiDef);
    expect(expressMw).toBeInstanceOf(Function);

    await expressMw(request, response, next);

    expect(next).toBeCalled();
    expect(saveCostMock).toBeCalled();
    expect(getTotalCostMock).toBeCalled();
  });
});
