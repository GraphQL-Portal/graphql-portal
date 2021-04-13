import { initTracer as initJaegerTracer } from 'jaeger-client';
import { prefixLogger } from '@graphql-portal/logger';

export const tracer = initJaegerTracer(
  {
    serviceName: 'graphql-portal',
    sampler: {
      type: 'const',
      param: 1,
    },
    reporter: {
      logSpans: true,
    },
  },
  { logger: prefixLogger('jaeger') }
);
