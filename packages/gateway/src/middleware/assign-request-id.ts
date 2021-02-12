import { RequestHandler } from 'express';
import uuid from 'uuid';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';

const assignRequestId: RequestHandler = (req, res, next) => {
  req.id = uuid.v4();

  const metricData = {
    query: req.body || '',
    userAgent: req.headers?.['user-agent'] || '',
    ip: req.ip,
    request: req,
  };

  metricEmitter.emit(MetricsChannels.GOT_REQUEST, req.id, metricData);

  req.context.tracerSpan.setTag('requestId', req.id);
  req.context.tracerSpan.log({
    userAgent: metricData.userAgent,
    ip: metricData.ip
  });

  next();
};

export default (): RequestHandler => assignRequestId;
