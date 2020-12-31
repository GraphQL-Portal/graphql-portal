import { config, loadApiDefs } from '@graphql-portal/config';
import { logger } from '@graphql-portal/logger';
import { Channel } from '@graphql-portal/types';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import setupRedis from '../redis';
import setupControlApi from './control-api';
import { setRouter, updateApi } from './router';

export type ForwardHeaders = Record<string, string>;
export interface Context {
  forwardHeaders: ForwardHeaders;
}

export const nodeId: string = uuidv4();

export async function startServer(): Promise<void> {
  const app = express();
  const httpServer = createServer(app);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(graphqlUploadExpress());

  await setRouter(app, config.apiDefs);

  if (config.gateway.use_dashboard_configs) {
    const redis = await setupRedis(config.gateway.redis_connection_string);
    logger.info('Redis connected');

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

  // TODO: web sockets support

  httpServer.listen(config.gateway.listen_port, config.gateway.hostname, () => {});
}
