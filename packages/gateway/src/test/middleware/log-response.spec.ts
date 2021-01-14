import { NextFunction, Response } from 'express';
import { metricEmitter, MetricsChannels } from '../../metric';
import { logResponse } from '../../middleware';

jest.mock('../../metric/emitter', () => ({
  metricEmitter: {
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

describe('Log response MW', () => {
  let mockRequest: {
    id: 'id';
  };
  let nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      on: jest.fn().mockImplementation(),
      write: jest.fn().mockImplementation(),
      end: jest.fn().mockImplementation(),
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
      expect(metricEmitter.emit).toBeCalledWith(
        MetricsChannels.SENT_RESPONSE,
        mockRequest.id,
        body,
        buffer.byteLength
      );
    });
  });
});
