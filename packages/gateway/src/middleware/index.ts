import { RequestMiddleware } from './request-middleware.interface';
import mw_ip_filtering from './mw_ip_filtering';
import collectBytes from './collect-bytes';
import assignRequestId from './assign-request-id';

const defaultMiddlewares: RequestMiddleware[] = [assignRequestId, collectBytes, mw_ip_filtering];
export * from './forward-headers';
export * from './load-custom-middlewares';
export * from './request-middleware.interface';
export * from './log-response';
export * from './log-response-error';

export { defaultMiddlewares };
