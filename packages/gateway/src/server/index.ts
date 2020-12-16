import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import redisConnect from '../redis';
import { logger } from '../logger';
import { setRouter } from './router';
import { GatewayConfig, loadAPIDefs } from '@graphql-portal/config';

export const nodeID: string = uuidv4();

export async function startServer(gatewayConfig: GatewayConfig): Promise<void> {
  const apis = await loadAPIDefs(gatewayConfig);

  const redis = await redisConnect(gatewayConfig.redis_connection_string);
  logger.info('Redis connected');

  const app = express();
  const httpServer = createServer(app);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(graphqlUploadExpress());

  await setRouter(app, apis);
  redis.subscribe('apis-defs-updated');
  redis.on('message', async (channel) => {
    if (channel !== 'apis-defs-updated') {
      return;
    }
    await setRouter(app, apis);
  });

  // TODO: web sockets support

  httpServer.listen(gatewayConfig.listen_port, gatewayConfig.hostname, () => {});
}
