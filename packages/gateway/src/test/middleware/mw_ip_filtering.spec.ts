import { ApiDef } from '@graphql-portal/types';
import { NextFunction, Request, Response } from 'express';
import mw_ip_filtering from '../../middleware/ip-filtering';

describe('IP Filtering MW', () => {
  let mockRequest: Partial<Request>;
  let nextFunction: NextFunction = jest.fn();
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnValue(mockResponse),
      send: jest.fn().mockReturnValue(mockResponse),
    };
  });

  describe('without config', () => {
    const apiDef: ApiDef = {
      name: 'test',
      sources: [],
      endpoint: '/endpoint',
    };

    it('should pass the request', () => {
      const expressMw = mw_ip_filtering(apiDef);
      expect(expressMw).toBeInstanceOf(Function);

      expressMw(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });
  });

  describe('with filtering enabled but without IPs', () => {
    const apiDef: ApiDef = {
      name: 'test',
      sources: [],
      endpoint: '/endpoint',
      enable_ip_filtering: true,
    };

    it('should pass the request', () => {
      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });
  });

  describe('with config', () => {
    const apiDef: ApiDef = {
      name: 'test',
      sources: [],
      endpoint: '/endpoint',
      enable_ip_filtering: true,
      allow_ips: [],
      deny_ips: [],
    };

    const mockIPAddress = '192.168.1.9';

    beforeEach(() => {
      mockRequest = {
        headers: {
          'x-client-ip': mockIPAddress,
        },
      };
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should pass if allow & deny are empty', () => {
      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });

    it('should pass if IPs in config are incorrect', () => {
      apiDef.allow_ips = ['asdf'];
      apiDef.deny_ips = ['asdf'];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });

    it('should pass if Request IP matches the allow_ips', () => {
      apiDef.allow_ips = [mockIPAddress];
      apiDef.deny_ips = [];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });

    it("should pass if Request IP doesn't match deny_ips", () => {
      apiDef.allow_ips = [];
      apiDef.deny_ips = ['127.0.0.1'];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });

    it("should return 401 if Req IP doesn't match allow_ips", () => {
      apiDef.allow_ips = ['127.0.0.1'];
      apiDef.deny_ips = [];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).not.toBeCalled();
      expect(mockResponse.status).toBeCalledWith(401);
    });

    it('should return 401 if Req IP matches deny_ips', () => {
      apiDef.allow_ips = [];
      apiDef.deny_ips = [mockIPAddress];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).not.toBeCalled();
      expect(mockResponse.status).toBeCalledWith(401);
    });

    it('should pass if Req IP matches allow_ips && deny_ips', () => {
      apiDef.allow_ips = [mockIPAddress];
      apiDef.deny_ips = [mockIPAddress];

      mw_ip_filtering(apiDef)(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toBeCalled();
    });
  });
});
