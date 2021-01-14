import { RequestHandler } from 'express';
import uuid from 'uuid';
import { RequestWithId } from '../interfaces';
import { metricEmitter, MetricsChannels } from '../metric';

const assignRequestId: RequestHandler = (req: RequestWithId, res, next) => {
  req.id = uuid.v4();
  metricEmitter.emit(MetricsChannels.GOT_REQUEST, req.id, {
    query: req.body,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    request: req,
  });
  next();
};

export default () => assignRequestId;
