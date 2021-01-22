import { ErrorRequestHandler } from 'express';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';

export const logResponseError: ErrorRequestHandler = (err, req, res, next) => {
  if (err) metricEmitter.emit(MetricsChannels.GOT_ERROR, req.id, err);
  next(err);
};
