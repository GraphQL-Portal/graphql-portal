import { MetricsChannels } from '@graphql-portal/types';
import { NextFunction, Request, Response } from 'express';
import { Tracer } from 'opentracing';
import assignRequestId from '../../middleware/assign-request-id';
import { isIntrospectionRequest } from '../../middleware/utils';
import { metricEmitter } from '../../metric';

jest.mock('uuid', () => ({
  v4: () => 'requestId',
}));
jest.mock('../../tracer');

jest.mock('../../middleware/utils', () => ({
  isIntrospectionRequest: jest.fn().mockReturnValue(false),
}));

jest.mock('../../metric/emitter', () => ({
  metricEmitter: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

describe('Assign reequest id MW', () => {
  let mockRequest: Partial<Request>;
  let nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: 'body',
      ip: 'ip',
      context: {
        forwardHeaders: {},
        requestId: 'requestId',
        tracerSpan: new Tracer().startSpan('test'),
      },
      headers: {
        'user-agent': 'user-agent',
      },
    };
    mockResponse = {
      on: jest.fn(),
    };
  });

  it('should assign id to request and call emit', () => {
    const expressMw = assignRequestId();
    expect(expressMw).toBeInstanceOf(Function);

    expressMw(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(isIntrospectionRequest).toBeCalled();
    expect(nextFunction).toBeCalled();
    expect(mockRequest.id).toBe('requestId');
    expect(metricEmitter.emit).toBeCalledTimes(1);
    expect(metricEmitter.emit).toBeCalledWith(MetricsChannels.GOT_REQUEST, 'requestId', {
      query: mockRequest.body,
      userAgent: mockRequest?.headers?.['user-agent'],
      ip: mockRequest.ip,
      request: mockRequest,
      date: expect.any(Number),
    });
  });
});
