import { prepareForwardedHeader, RequestMiddleware } from './index';
import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';

const getMiddleware: RequestMiddleware = function(apiDef: ApiDef): RequestHandler {
  prepareForwardedHeader('x-auth', apiDef);

  return function(req, res, next) {
    req.context.forwardHeaders['x-auth'] = 'test';

    next();
  };
};

export default getMiddleware;
