import { config, initConfig, loadApiDefs } from '@graphql-portal/config';
import { configureLogger, logger } from '@graphql-portal/logger';
import cluster from 'cluster';
import { cpus } from 'os';
import { applyRegisteredHandlers, registerWorkerHandler, spreadMessageToWorkers } from './ipc/utils';
import { startServer } from './server';

function handleStopSignal(): void {
  logger.info('Stop signal received');
  process.exit(0);
}

async function start(): Promise<void> {
  if (cluster.isMaster) {
    await initConfig();
    if (!config.gateway) {
      throw new Error('Error loading the gateway.json|yaml configuration file.');
    }

    configureLogger(config.gateway);
    await loadApiDefs();

    const numCPUs: number = Number(config.gateway.pool_size) ? Number(config.gateway.pool_size) : cpus().length;

    logger.info(`GraphQL Portal API Gateway v${process.env.npm_package_version}`);
    logger.info(
      `🔥 Starting GraphQL API Portal with ${numCPUs} workers on: http://${config.gateway.hostname}:${config.gateway.listen_port}`
    );

    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      logger.warn(`worker ${worker.process.pid} died`);
      cluster.fork();
    });

    process.on('SIGINT', handleStopSignal);
    process.on('SIGTERM', handleStopSignal);

    spreadMessageToWorkers({ event: 'config', data: config });
    applyRegisteredHandlers();
  } else {
    await new Promise((resolve) => {
      registerWorkerHandler('config', (message) => {
        (config as any) = message.data;
        resolve(config);
      });
    });
    configureLogger(config.gateway);
    applyRegisteredHandlers();
    await startServer();
  }
}

start().catch((error) => {
  logger.error(`😵️ Stopping the server due to fatal error: ${error.message}\n${error.stack}`);
  process.exit(1);
});
