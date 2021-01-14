import { request, RequestHandler } from 'express';
import uuid from 'uuid';
import { metricEmitter, MetricsChannels } from '../metric';

const assignRequestId: RequestHandler = (req, res, next) => {
  req.id = uuid.v4();
  request.context
  metricEmitter.emit(MetricsChannels.GOT_REQUEST, req.id, {
    query: req.body,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    request: req,
  });
  next();
};

export default () => assignRequestId;
