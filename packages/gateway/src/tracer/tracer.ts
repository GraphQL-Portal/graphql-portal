import { initTracer as initJaegerTracer, JaegerTracer } from 'jaeger-client';
import { prefixLogger } from '@graphql-portal/logger';
import { Config } from '@graphql-portal/config';

let tracer: JaegerTracer;

function initTracer(config: Config) {
  const { host, port } = config?.gateway?.tracing || {};
  tracer = initJaegerTracer(
    {
      serviceName: 'graphql-portal',
      sampler: {
        type: 'const',
        param: 1,
      },
      reporter: {
        logSpans: true,
        agentHost: host,
        agentPort: port,
      },
    },
    { logger: prefixLogger('jaeger') }
  );
}

export { tracer, initTracer };
