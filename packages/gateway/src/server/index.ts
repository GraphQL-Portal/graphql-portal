import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { Channel } from '@graphql-portal/types';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer, Server } from 'http';
import { Span } from 'opentracing';
import { promisify } from 'util';
import { getConfigFromMaster } from '../ipc/utils';
import { startPeriodicMetricsRecording } from '../metric';
import { logResponse } from '../middleware';
import { redisSubscriber } from '../redis';
import setupControlApi from './control-api';
import { setRouter, updateApi } from './router';

const logger = prefixLogger('server');

export type ForwardHeaders = Record<string, undefined | string | string[]>;
export interface Context {
  forwardHeaders: ForwardHeaders;
  requestId: string;
  tracerSpan?: Span;
  resolverSpans: { [path: string]: Span };
}

// Helper for metrics gathering
export const connections = {
  get: async (): Promise<number> => 0,
};

export let httpServer: Server;

export async function startServer(): Promise<void> {
  const app = express();
  httpServer = createServer(app);

  connections.get = promisify(httpServer.getConnections.bind(httpServer));

  app.get('/health', (_, res) => res.sendStatus(200));

  app.disable('x-powered-by');

  app.use(bodyParser.json({ limit: config.gateway.request_size_limit || '100kb' }));
  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.use(logResponse);

  // configure global CORS
  if (config.gateway.use_dashboard_configs || config.gateway.cors?.enabled) {
    app.use(cors(getCorsOptions()));
  }

  setupControlApi(app);

  setRouter(app, config.apiDefs);

  redisSubscriber.subscribe(Channel.apiDefsUpdated);
  redisSubscriber.on('message', async (channel, timestamp) => {
    if (channel !== Channel.apiDefsUpdated) {
      return;
    }

    logger.info('Received "apiDefsUpdate" message from Dashboard via Redis.');

    if (+timestamp && +timestamp <= config.timestamp) {
      logger.info('New config is equal to the current one. Skipping update process.');
      return;
    }

    const { loaded } = await getConfigFromMaster();
    if (!loaded) return;
    await setRouter(app, config.apiDefs);
  });

  config.apiDefs.forEach((apiDef) => {
    if (!apiDef.schema_polling_interval) {
      return;
    }
    setInterval(() => updateApi(apiDef), apiDef.schema_polling_interval);
  });

  if (config.apiDefs.length === 0) {
    logger.warn('Server is going to start with 0 API definitions and will not proxy anything...');
  }
  // TODO: web sockets support

  httpServer.listen(config.gateway.listen_port, config.gateway.hostname, () => {});

  if (config.gateway?.enable_metrics_recording) {
    startPeriodicMetricsRecording();
  }

  logger.info(`🐥 Started server in the worker process`);
}

/**
 * Get and merge CORS options from various configs
 */
function getCorsOptions(): cors.CorsOptions {
  const opts: cors.CorsOptions = {};
  if (config.gateway.use_dashboard_configs && config.gateway.dashboard_config?.connection_string) {
    opts.origin = [config.gateway.dashboard_config.connection_string];
  }

  if (config.gateway.cors?.enabled) {
    const { enabled, origins, ...options } = config.gateway.cors;
    const additionalOrigins = origins ?? [];

    Object.assign(opts, options);
    Array.isArray(opts.origin) ? opts.origin.push(...additionalOrigins) : (opts.origin = [...additionalOrigins]);
    opts.origin = opts.origin.map((origin) => (typeof origin === 'string' ? origin.replace(/\/+$/, '') : origin));
  }

  logger.info(`Enabling CORS for following Origins: ${JSON.stringify(opts.origin)}`);
  return opts;
}
