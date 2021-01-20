import { RequestHandler } from 'express';
import { ApiDef } from '@graphql-portal/types';
import { RequestMiddleware } from './request-middleware.interface';
import { prefixLogger } from '@graphql-portal/logger';
import bytes from 'bytes';

const logger = prefixLogger('request-size-limit');

const getMiddleware: RequestMiddleware = function(apiDef: ApiDef): RequestHandler {
  let limit = bytes.parse(apiDef.request_size_limit!);

  return function(req, res, next) {
    const length = Number(req.headers['content-length']);
    if (limit && length && length > limit) {
      logger.debug(`size ${length}, limit ${limit}`);
      res.status(413).json({ message: 'request payload too large', limit, length });
      return;
    }
    next();
  };
};

export default getMiddleware;
