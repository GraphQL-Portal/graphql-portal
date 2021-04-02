import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';
import { isIntrospectionRequest } from './utils';

const assignRequestId: RequestHandler = (req, res, next) => {
  if (isIntrospectionRequest(req)) return next();
  req.id = uuidv4();
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
