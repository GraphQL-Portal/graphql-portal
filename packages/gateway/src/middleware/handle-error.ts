import { ErrorRequestHandler } from 'express';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  metricEmitter.emit(MetricsChannels.GOT_ERROR, req.id, err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode || 500).json(err);
};
