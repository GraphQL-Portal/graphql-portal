import { MetricsChannels } from '@graphql-portal/types';
import { NextFunction, Response } from 'express';
import { Tracer } from 'opentracing';
import { metricEmitter } from '../../metric';
import { logResponse } from '../../middleware';

jest.mock('../../metric/emitter', () => ({
  metricEmitter: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

describe('Log response MW', () => {
  const mockRequest = {
    id: 'id',
    context: {
      requestId: 'requestId',
      forwardHeaders: {},
      tracerSpan: (new Tracer()).startSpan('test'),
    },
  };
  const nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
  });

  it('should handle data and call emit on response end', () => {
    expect(logResponse).toBeInstanceOf(Function);

    logResponse(mockRequest as any, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalled();

    const body = 'body';
    const buffer = Buffer.from(body);

    (mockResponse as any).write(buffer, () => {
      (mockResponse as any).end();
      expect(metricEmitter.emit).toBeCalledTimes(1);
      expect(metricEmitter.emit).toBeCalledWith(MetricsChannels.SENT_RESPONSE, mockRequest.id, body, buffer.byteLength);
    });
  });
});
