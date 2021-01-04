import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './request-middleware.interface';
import { prepareForwardedHeader, setForwardedHeader } from './forward-headers';

const getMiddleware: RequestMiddleware = function (apiDef: ApiDef): RequestHandler {
  const header = 'x-auth';
  prepareForwardedHeader(header, apiDef);

  return function (req, res, next) {
    setForwardedHeader(req, header, 'test');

    next();
  };
};

export default getMiddleware;
