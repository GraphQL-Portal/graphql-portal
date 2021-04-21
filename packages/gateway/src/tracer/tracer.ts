import { Tracer } from 'opentracing';
import { AvailableTracers } from '@graphql-portal/types';
import DatadogTracer from 'dd-trace';
import { initTracer as initJaegerTracer } from 'jaeger-client';
import { prefixLogger } from '@graphql-portal/logger';
import { Config } from '@graphql-portal/config';

const logger = prefixLogger('tracer');

let tracer: Tracer | undefined;

function initTracer(config: Config): void {
  const tracing = config?.gateway?.tracing || {};
  if (!tracing.enable) return;

  const serviceName = 'graphql-portal';
  const sampleRate = 1;

  if ((tracing.enable === true || tracing.enable === AvailableTracers.JAEGER) && tracing.jaeger) {
    logger.info('Initializing Jaeger tracer');

    const { host, port } = tracing.jaeger;
    tracer = initJaegerTracer(
      {
        serviceName,
        sampler: {
          type: 'const',
          param: sampleRate,
        },
        reporter: {
          logSpans: true,
          agentHost: host,
          agentPort: port,
        },
      },
      { logger: prefixLogger(AvailableTracers.JAEGER) }
    );
  } else if (tracing.enable === AvailableTracers.DATADOG && tracing.datadog) {
    logger.info('Initializing Datadog tracer');

    const { host, port } = tracing.datadog;
    tracer = DatadogTracer.init({
      service: serviceName,
      hostname: host,
      port,
      sampleRate,
      logger: prefixLogger(AvailableTracers.DATADOG),
    });
  }
}

export { tracer, initTracer };
