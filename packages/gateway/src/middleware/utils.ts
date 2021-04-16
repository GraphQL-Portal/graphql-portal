import { Request } from 'express';
import { Span } from 'opentracing';

export function isIntrospectionRequest(req: Request): boolean {
  const { method, body } = req;
  if (method !== 'POST' || !body?.query || body?.operationName === 'IntrospectionQuery') {
    return true;
  }
  return false;
}

export function throwError(error: Error, statusCode = 400, span?: Span): void {
  error.statusCode = statusCode;
  span?.log({ error });
  span?.finish();
  throw error;
}
