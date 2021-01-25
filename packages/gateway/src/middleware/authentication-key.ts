import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './request-middleware.interface';
import { prefixLogger } from '@graphql-portal/logger';

const logger = prefixLogger('authentication-key');

const getMiddleware: RequestMiddleware = function (apiDef: ApiDef): RequestHandler {
  if (!apiDef.authentication?.auth_tokens.length) {
    return (req, res, next) => next();
  }
  const authHeaderName = apiDef.authentication?.auth_header_name || 'authorization';
  return function authenticationKey(req, res, next) {
    const authKey = req.headers[authHeaderName]?.toString();
    if (!authKey || !apiDef.authentication!.auth_tokens.includes(authKey)) {
      logger.debug(`Wrong key for api ${apiDef.name}`);
      res.status(401).json({ message: 'Wrong authorization token' });
      return;
    }
    next();
  };
};

export default getMiddleware;
