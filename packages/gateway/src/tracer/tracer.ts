import { initTracer as initJaegerTracer } from 'jaeger-client';

export const tracer = initJaegerTracer({
  serviceName: 'graphql-portal',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    logSpans: true,
  },
}, {});
