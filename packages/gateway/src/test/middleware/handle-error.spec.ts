import { NextFunction, Response } from 'express';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../../metric';
import { handleError } from '../../middleware';

jest.mock('../../tracer');
jest.mock('../../metric/emitter', () => ({
  metricEmitter: {
    emit: jest.fn(),
  },
}));

describe('Handle error MW', () => {
  const mockRequest = {
    id: 'id',
  };
  let nextFunction: NextFunction = jest.fn();
  let responseJson: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      headersSent: false,
      on: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      status: jest.fn(() => {
        return {
          json: responseJson,
        } as any;
      }),
    };
  });

  it('should call emit and send error', () => {
    const error = new Error();
    error.statusCode = 420;
    expect(handleError).toBeInstanceOf(Function);

    handleError(error, mockRequest as any, mockResponse as Response, nextFunction);
    expect(responseJson).toBeCalledWith(error);
    expect(mockResponse.status).toBeCalledWith(error.statusCode);
    expect(metricEmitter.emit).toBeCalledTimes(1);
    expect(metricEmitter.emit).toBeCalledWith(MetricsChannels.GOT_ERROR, mockRequest.id, error, expect.any(Number));
  });
});
