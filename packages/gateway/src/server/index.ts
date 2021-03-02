import { config } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import { Channel } from '@graphql-portal/types';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { getConfigFromMaster } from '../ipc/utils';
import { promisify } from 'util';
import { startPeriodicMetricsRecording } from '../metric';
import { logResponse } from '../middleware';
import setupRedis from '../redis';
import setupControlApi from './control-api';
import { setRouter, updateApi } from './router';

const logger = prefixLogger('server');

export type ForwardHeaders = Record<string, string>;
export interface Context {
  forwardHeaders: ForwardHeaders;
  requestId: string;
}

// Helper for metrics gathering
export const connections = {
  get: async (): Promise<number> => 0,
};

export async function startServer(): Promise<void> {
  const redisSubscriber = await setupRedis(config.gateway.redis_connection_string);

  const app = express();
  const httpServer = createServer(app);

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

  // setting Control API for APIDefs
  const apiDefsToControlApi = config.apiDefs.filter((apiDef) => apiDef.schema_updates_through_control_api);
  if (config.gateway.enable_control_api && apiDefsToControlApi.length) {
    setupControlApi(app, apiDefsToControlApi);
  }

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

  if (config.gateway?.metrics?.enabled) {
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
  }

  logger.info(`Enabling CORS for following Origins: ${JSON.stringify(opts.origin)}`);
  return opts;
}
