import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './request-middleware.interface';
import { prefixLogger } from '@graphql-portal/logger';

const logger = prefixLogger('authentication-key');

const getMiddleware: RequestMiddleware = function(apiDef: ApiDef): RequestHandler {
  if (!apiDef.authentication) {
    return (req, res, next) => next();
  }

  return function authenticationKey(req, res, next) {
    const { authentication } = req.headers;
    if (authentication !== apiDef.authentication) {
      logger.debug(`Wrong key for api ${apiDef.name}: ${authentication}`);
      res.status(401).json({ message: 'Wrong authentication key' });
      return;
    }
    next();
  };
};

export default getMiddleware;
