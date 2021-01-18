import { RequestMiddleware } from './request-middleware.interface';
import ipFiltering from './ip-filtering';
import requestSizeLimit from './request-size-limit';

const defaultMiddlewares: RequestMiddleware[] = [ipFiltering, requestSizeLimit];
export * from './forward-headers';
export * from './load-custom-middlewares';
export * from './request-middleware.interface';
export { defaultMiddlewares };
