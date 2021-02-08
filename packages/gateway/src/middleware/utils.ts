import { Request } from 'express';

export function isPlaygroundRequest(req: Request): boolean {
  const { method, body } = req;
  if (method !== 'POST' || !body?.query || body?.operationName === 'IntrospectionQuery') {
    return true;
  }
  return false;
}

export function throwError(error: Error, statusCode = 400): void {
  error.statusCode = statusCode;
  throw error;
}
