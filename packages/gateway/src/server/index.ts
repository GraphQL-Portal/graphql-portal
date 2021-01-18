import { config, loadApiDefs } from '@graphql-portal/config';
import { logger } from '@graphql-portal/logger';
import { Channel } from '@graphql-portal/types';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { promisify } from 'util';
import { startPeriodicMetricsRecording } from '../metric';
import { logResponse, logResponseError } from '../middleware';
import setupRedis, { redisSubscriber } from '../redis';
import setupControlApi from './control-api';
import { setRouter, updateApi } from './router';

export type ForwardHeaders = Record<string, string>;
export interface Context {
  forwardHeaders: ForwardHeaders;
  requestId: string;
}

export const connections = {
  get: async () => 0,
};

export async function startServer(): Promise<void> {
  await setupRedis(config.gateway.redis_connection_string);

  const app = express();
  const httpServer = createServer(app);

  connections.get = promisify(httpServer.getConnections.bind(httpServer));

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.use(logResponse);

  const apiDefsToControlApi = config.apiDefs.filter((apiDef) => apiDef.schema_updates_through_control_api);
  if (apiDefsToControlApi.length) {
    setupControlApi(app, apiDefsToControlApi);
  }

  setRouter(app, config.apiDefs);

  app.use(logResponseError);

  redisSubscriber.subscribe(Channel.apiDefsUpdated);
  redisSubscriber.on('message', async (channel, timestamp) => {
    if (channel !== Channel.apiDefsUpdated) {
      return;
    }
    if (+timestamp && +timestamp <= config.timestamp) {
      return;
    }
    await loadApiDefs();
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

  startPeriodicMetricsRecording();

  logger.info(`🐥 Started server in the worker process`);
}
