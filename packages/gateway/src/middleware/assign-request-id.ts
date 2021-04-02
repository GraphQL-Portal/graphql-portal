import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';
import { isIntrospectionRequest } from './utils';
import { prefixLogger } from '@graphql-portal/logger';

const logger = prefixLogger('metrics:assign-request-id');

const assignRequestId: RequestHandler = (req, res, next) => {
  if (isIntrospectionRequest(req)) return next();
  req.id = uuidv4();
  logger.debug(`req.id = ${req.id}`);
  metricEmitter.emit(MetricsChannels.GOT_REQUEST, req.id, {
    query: req.body || '',
    userAgent: req.headers?.['user-agent'] || '',
    ip: req.ip,
    request: req,
    date: Date.now(),
  });
  next();
};

export default (): RequestHandler => assignRequestId;
