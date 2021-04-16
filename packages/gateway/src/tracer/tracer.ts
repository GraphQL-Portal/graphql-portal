import { initTracer as initJaegerTracer, JaegerTracer } from 'jaeger-client';
import { prefixLogger } from '@graphql-portal/logger';
import { Config } from '@graphql-portal/config';

let tracer: JaegerTracer | undefined;

function initTracer(config: Config): void {
  const tracing = config?.gateway?.tracing || {};
  if (!tracing.enable) return;

  if (!tracing.jaeger) return;
  const { host, port } = tracing.jaeger;
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
