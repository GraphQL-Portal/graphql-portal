import { config, initConfig, loadApiDefs } from '@graphql-portal/config';
import { logger } from '@graphql-portal/logger';
import cluster from 'cluster';
import { cpus } from 'os';
import { nodeId, startServer } from './server';

function handleStopSignal(): void {
  logger.info('Stop signal received');
  // close connections to Redis
  // deregister from dashboard
  // TODO: allow more graceful shutdown and error logging
  process.exit(0);
}

async function start(): Promise<void> {
  // TODO: config should be read by master and communicated to forks via RPC
  await initConfig();
  await loadApiDefs();
  if (!config.gateway) {
    throw new Error('Error loading the gateway.json|yaml configuration file.');
  }

  const numCPUs: number = Number(config.gateway.pool_size) ? Number(config.gateway.pool_size) : cpus().length;

  if (numCPUs > 1) {
    if (cluster.isMaster) {
      logger.info(`GraphQL Portal API Gateway v${process.env.npm_package_version}`);
      logger.info(`Cluster master process pid: ${process.pid}`);
      logger.info(`Cluster master process nodeId: ${nodeId}`);
      logger.info(
        `🔥 Starting GraphQL API Portal with ${numCPUs} workers on: http://${config.gateway.hostname}:${config.gateway.listen_port}`
      );

      for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        logger.warn(`worker ${worker.process.pid} died`);
      });

      process.on('SIGINT', handleStopSignal);
      process.on('SIGTERM', handleStopSignal);
    } else {
      startServer();
      logger.info(`Started worker process ➜ pid: ${process.pid}, nodeId: ${nodeId}`);
    }
  } else {
    startServer();
    logger.info(
      `🔥 Started GraphQL API Portal ➜ http://${config.gateway.hostname}:${config.gateway.listen_port}, pid: ${process.pid}`
    );
  }
}

start().catch((error) => {
  logger.error(`😵️ Stopping the server due to fatal error: ${error.message}\n${error.stack}`);
  process.exit(1);
});
