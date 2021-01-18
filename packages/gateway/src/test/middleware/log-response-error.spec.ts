import { NextFunction, Response } from 'express';
import { metricEmitter, MetricsChannels } from '../../metric';
import { logResponseError } from '../../middleware';

jest.mock('../../metric/emitter', () => ({
  metricEmitter: {
    emit: jest.fn(),
  },
}));

describe('Log response error MW', () => {
  const mockRequest = {
    id: 'id',
  };
  let nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    };
  });

  it('should call next function', () => {
    expect(logResponseError).toBeInstanceOf(Function);

    logResponseError(null, mockRequest as any, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect(nextFunction).toBeCalledWith(null);
    expect(metricEmitter.emit).toBeCalledTimes(0);
  });

  it('should call emit and pass error to next function', () => {
    const error = new Error();
    expect(logResponseError).toBeInstanceOf(Function);

    logResponseError(error, mockRequest as any, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect(nextFunction).toBeCalledWith(error);
    expect(metricEmitter.emit).toBeCalledTimes(1);
    expect(metricEmitter.emit).toBeCalledWith(MetricsChannels.GOT_ERROR, mockRequest.id, error);
  });
});
