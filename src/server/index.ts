import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { config, loadApis } from '@graphql-portal/config';
import { logger } from '@graphql-portal/logger';
import setupRedis from '../redis';
import Channel from '../redis/channel.enum';
import { setRouter } from './router';

export const nodeId: string = uuidv4();

export async function startServer(): Promise<void> {
  const redis = await setupRedis(config.gateway.redis_connection_string);
  logger.info('Redis connected');

  const app = express();
  const httpServer = createServer(app);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(graphqlUploadExpress());

  await setRouter(app, config.apis);
  redis.subscribe(Channel.apiDefsUpdated);
  redis.on('message', async (channel) => {
    if (channel !== Channel.apiDefsUpdated) {
      return;
    }
    await loadApis();
    await setRouter(app, config.apis);
  });

  // TODO: web sockets support

  httpServer.listen(config.gateway.listen_port, config.gateway.hostname, () => {});
}
