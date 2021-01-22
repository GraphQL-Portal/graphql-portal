import { RequestHandler } from 'express';
import uuid from 'uuid';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';

const assignRequestId: RequestHandler = (req, res, next) => {
  req.id = uuid.v4();
  metricEmitter.emit(MetricsChannels.GOT_REQUEST, req.id, {
    query: req.body || '',
    userAgent: req.headers?.['user-agent'] || '',
    ip: req.ip,
    request: req,
  });
  next();
};

export default () => assignRequestId;
