import { NextFunction, Request, Response } from 'express';
import assignRequestId from '../../middleware/assign-request-id';
import * as metricService from '../../metric';

jest.mock('uuid', () => ({
  v4: () => 'requestId',
}));

jest.mock('../../metric', () => ({
  metricEmitter: {
    on: jest.fn(),
    emit: jest.fn(),
  },
  MetricsChannels: {
    GOT_REQUEST: 'GOT_REQUEST',
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
      headers: {
        'user-agent': 'user-agent',
      },
    };
    mockResponse = {
      on: jest.fn().mockImplementation(),
    };
  });

  it('should assign id to request and call emit', () => {
    const expressMw = assignRequestId();
    expect(expressMw).toBeInstanceOf(Function);

    expressMw(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect((mockRequest as any).id).toBe('requestId');
    expect(metricService.metricEmitter.emit).toBeCalledTimes(1);
    expect(metricService.metricEmitter.emit).toBeCalledWith(metricService.MetricsChannels.GOT_REQUEST, 'requestId', {
      query: mockRequest.body,
      userAgent: mockRequest?.headers?.['user-agent'],
      ip: mockRequest.ip,
      request: mockRequest,
    });
  });
});
