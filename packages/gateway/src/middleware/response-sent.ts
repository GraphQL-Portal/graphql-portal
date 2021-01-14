import { ErrorRequestHandler, RequestHandler } from 'express';
import { RequestWithId } from 'src/interfaces';
import { metricEmitter, MetricsChannels } from '../metric';

let error: Error | null = null;

export const responseSent: RequestHandler = (req: RequestWithId, res, next) => {
  const oldWrite = res.write.bind(res);
  const oldEnd = res.end.bind(res);

  const chunks: Buffer[] = [];

  res.write = (...args: any[]) => {
    chunks.push(args[0]);
    return oldWrite(...args);
  };

  res.end = (...args: any[]) => {
    if (args[0] instanceof Buffer) chunks.push(args[0]);
    return oldEnd(...args);
  };

  res.on('finish', () => {
    const buffer = Buffer.concat(chunks);
    const contentLength = buffer.byteLength;
    const responseBody = buffer.toString('utf8');
    metricEmitter.emit(MetricsChannels.SENT_RESPONSE, req.id, responseBody, contentLength, error);
    error = null;
  });

  next();
};

export const setError: ErrorRequestHandler = (err, req, res, next) => {
  error = err;
  next(err);
};
