import assignRequestId from './assign-request-id';
import collectBytes from './collect-bytes';
import rateLimit from './graphql-rate-limit/rate-limit';
import ipFiltering from './ip-filtering';
import { RequestMiddleware } from './request-middleware.interface';
import requestSizeLimit from './request-size-limit';
import authenticationKey from './authentication-key';

const defaultMiddlewares: RequestMiddleware[] = [
  assignRequestId,
  collectBytes,
  ipFiltering,
  authenticationKey,
  requestSizeLimit,
  rateLimit,
];

export * from './forward-headers';
export * from './load-custom-middlewares';
export * from './log-response';
export * from './log-response-error';
export * from './request-middleware.interface';
export { defaultMiddlewares };
