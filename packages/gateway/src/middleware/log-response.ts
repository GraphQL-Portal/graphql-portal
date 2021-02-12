import { RequestHandler } from 'express';
import { MetricsChannels } from '@graphql-portal/types';
import { metricEmitter } from '../metric';

export const logResponse: RequestHandler = (req, res, next) => {
  const oldWrite = res.write.bind(res);
  const oldEnd = res.end.bind(res);

  const chunks: Buffer[] = [];

  res.write = (...args: any[]): any => {
    chunks.push(args[0]);
    return oldWrite(...args);
  };

  res.end = (...args: any[]): any => {
    if (args[0] instanceof Buffer) chunks.push(args[0]);
    return oldEnd(...args);
  };

  res.on('finish', () => {
    const buffer = Buffer.concat(chunks);
    const contentLength = buffer.byteLength;
    const responseBody = buffer.toString('utf8');
    metricEmitter.emit(MetricsChannels.SENT_RESPONSE, req.id, responseBody, contentLength);
    req.context.tracerSpan.setTag('http.status', res.statusCode);
    req.context.tracerSpan.finish();
  });

  next();
};
