import { NextFunction, Request, Response } from 'express';
import collectBytes from '../../middleware/collect-bytes';

describe('Collect bytes MW', () => {
  let mockRequest: Partial<Request>;
  let nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      on: jest.fn().mockImplementation(),
    };
    mockResponse = {
      on: jest.fn().mockImplementation(),
    };
  });

  it('should add listener on request and response', () => {
    const expressMw = collectBytes();
    expect(expressMw).toBeInstanceOf(Function);

    expressMw(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalled();
    expect(mockRequest.on).toBeCalled();
    expect(mockRequest.on).toBeCalledWith('data', expect.any(Function));
    expect(mockResponse.on).toBeCalled();
    expect(mockResponse.on).toBeCalledWith('finish', expect.any(Function));
  });
});
