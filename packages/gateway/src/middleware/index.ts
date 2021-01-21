import assignRequestId from './assign-request-id';
import collectBytes from './collect-bytes';
import rateLimitMiddleware from './graphql-rate-limit/rate-limit';
import ipFiltering from './ip-filtering';
import { RequestMiddleware } from './request-middleware.interface';
import requestSizeLimit from './request-size-limit';

const defaultMiddlewares: RequestMiddleware[] = [
  assignRequestId,
  collectBytes,
  ipFiltering,
  requestSizeLimit,
  rateLimitMiddleware,
];

export * from './forward-headers';
export * from './load-custom-middlewares';
export * from './log-response';
export * from './handle-error';
export * from './request-middleware.interface';
export { defaultMiddlewares };
