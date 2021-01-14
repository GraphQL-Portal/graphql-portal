import { config, loadApiDefs } from '@graphql-portal/config';
import { logger } from '@graphql-portal/logger';
import { Channel } from '@graphql-portal/types';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import setupRedis from '../redis';
import { startPeriodicMetricsRecording } from '../metric';
import setupControlApi from './control-api';
import { setRouter, updateApi } from './router';
import cluster from 'cluster';
import { promisify } from 'util';
import { customAlphabet } from 'nanoid';
import { responseSent, setError } from '../middleware';

export type ForwardHeaders = Record<string, string>;
export interface Context {
  forwardHeaders: ForwardHeaders;
}

export const nodeId: string = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-', 11)();

export const connections = {
  get: async () => 0,
};

export async function startServer(): Promise<void> {
  const app = express();
  const httpServer = createServer(app);

  connections.get = async () => promisify(httpServer.getConnections.bind(httpServer))();

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(graphqlUploadExpress());
  app.use(responseSent);

  await setRouter(app, config.apiDefs);

  app.use(setError);

  if (config.gateway.use_dashboard_configs) {
    const redis = await setupRedis(config.gateway.redis_connection_string);
    logger.info('Connected to Redis at ➜ %s', config.gateway.redis_connection_string);

    redis.subscribe(Channel.apiDefsUpdated);
    redis.on('message', async (channel, timestamp) => {
      if (channel !== Channel.apiDefsUpdated) {
        return;
      }
      if (+timestamp && +timestamp <= config.timestamp) {
        return;
      }
      await loadApiDefs();
      await setRouter(app, config.apiDefs);
    });
  }

  config.apiDefs.forEach((apiDef) => {
    if (!apiDef.schema_polling_interval) {
      return;
    }
    setInterval(() => updateApi(apiDef), apiDef.schema_polling_interval);
  });

  const apiDefsToControlApi = config.apiDefs.filter((apiDef) => apiDef.schema_updates_through_control_api);
  if (apiDefsToControlApi.length) {
    await setupControlApi(app, apiDefsToControlApi);
  }

  if (config.apiDefs.length === 0) {
    logger.warn('Server is going to start with 0 API definitions and will not proxy anything...');
  }

  // TODO: web sockets support

  httpServer.listen(config.gateway.listen_port, config.gateway.hostname, () => {});

  await startPeriodicMetricsRecording(config.gateway.redis_connection_string);

  if (cluster.isMaster) {
    logger.info(
      `🔥 Started GraphQL API Portal ➜ http://${config.gateway.hostname}:${config.gateway.listen_port}, pid: ${process.pid}, nodeID: ${nodeId}`
    );
  } else {
    logger.info(`🐥 Started worker process ➜ pid: ${process.pid}, nodeId: ${nodeId}`);
  }
}
