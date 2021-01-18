import { RequestMiddleware } from './request-middleware.interface';
import collectBytes from './collect-bytes';
import assignRequestId from './assign-request-id';
import ipFiltering from './ip-filtering';
import requestSizeLimit from './request-size-limit';

const defaultMiddlewares: RequestMiddleware[] = [assignRequestId, collectBytes, ipFiltering, requestSizeLimit];
export * from './forward-headers';
export * from './load-custom-middlewares';
export * from './request-middleware.interface';
export * from './log-response';
export * from './log-response-error';

export { defaultMiddlewares };
