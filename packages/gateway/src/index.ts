import { config, initConfig, loadApiDefs } from '@graphql-portal/config';
import { configureLogger, prefixLogger } from '@graphql-portal/logger';
import cluster from 'cluster';
import { cpus } from 'os';
import { applyRegisteredHandlers, getConfigFromMaster, spreadMessageToWorkers } from './ipc/utils';
import { startServer } from './server';

const logger = prefixLogger('server');

function handleStopSignal(): void {
  logger.info('Stop signal received');
  process.exit(0);
}

async function start(): Promise<void> {
  if (cluster.isMaster) {
    await initConfig();
    configureLogger(config.gateway);
    await loadApiDefs();

    const numCPUs: number = Number(config.gateway.pool_size) ? Number(config.gateway.pool_size) : cpus().length;

    const gatewayVersion = process.env?.npm_package_version ? `v${process.env.npm_package_version}` : '';
    logger.info(`GraphQL Portal API Gateway ${gatewayVersion}`);
    const gatewayUrl = `http://${config.gateway.hostname}:${config.gateway.listen_port}`;
    logger.info(`🔥 Starting GraphQL API Portal with ${numCPUs} worker(s) on: ${gatewayUrl}, nodeID: ${config.nodeId}`);

    cluster.on('fork', (worker) => {
      logger.info(`forked worker ${worker.process.pid}`);
      spreadMessageToWorkers({ event: 'config', data: { config } });
    });

    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      logger.warn(`worker ${worker.process.pid} died`);
      cluster.fork();
    });

    process.on('SIGINT', handleStopSignal);
    process.on('SIGTERM', handleStopSignal);

    applyRegisteredHandlers();
  } else {
    await getConfigFromMaster();
    configureLogger(config.gateway);
    applyRegisteredHandlers();
    await startServer();
  }
}

start().catch((error) => {
  logger.error(`😵️ Stopping the server due to fatal error: ${error.message}\n${error.stack}`);
  process.exit(1);
});
