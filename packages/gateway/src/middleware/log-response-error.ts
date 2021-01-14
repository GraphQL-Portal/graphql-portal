import { ErrorRequestHandler } from 'express';
import { RequestWithId } from '../interfaces';
import { metricEmitter, MetricsChannels } from '../metric';

export const logResponseError: ErrorRequestHandler = (err, req: RequestWithId, res, next) => {
  if (err) metricEmitter.emit(MetricsChannels.GOT_ERROR, req.id, err);
  next(err);
};
