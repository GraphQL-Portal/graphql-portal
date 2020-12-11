import { cpus } from 'os';
import cluster from 'cluster';
import logger from './logger';
import { version } from '../package.json';
import { startServer, nodeID } from './server';
import { loadConfig } from './gateway-config';

function handleStopSignal(): void {
  logger.info('Stop signal received');
  // close connections to Redis
  // deregister from dashboard
  // TODO: allow more graceful shutdown and error logging
  process.exit(0);
}

async function start(): Promise<void> {
  const config = await loadConfig();

  const numCPUs: number = Number(config.pool_size) ? Number(config.pool_size) : cpus().length;

  if (numCPUs > 1) {
    if (cluster.isMaster) {
      logger.info(`GraphQL Portal API Gateway v${version}`);
      logger.info(`Cluster master process pid: ${process.pid}`);
      logger.info(`Cluster master process nodeID: ${nodeID}`);
      logger.info(
        `🔥 Starting GraphQL API Portal with ${numCPUs} workers on: http://${config.hostname}:${config.listen_port}`,
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
      startServer(config);
      logger.info(`Started worker process ➜ pid: ${process.pid}, nodeID: ${nodeID}`);
    }
  } else {
    startServer(config);
    logger.info(`🔥 Started GraphQL API Portal ➜ http://${config.hostname}:${config.listen_port}, pid: ${process.pid}`);
  }
}

start().catch((error) => {
  logger.error(`😵️ Stopping the server due to fatal error: ${error.message}\n${error.stack}`);
  process.exit(1);
});
