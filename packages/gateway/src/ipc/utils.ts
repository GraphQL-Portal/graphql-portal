import { Config, config, loadApiDefs } from '@graphql-portal/config';
import { prefixLogger } from '@graphql-portal/logger';
import cluster from 'cluster';
import { IPCEvent, IPCMessage, IPCMessageHandler } from './ipc-message.interface';

const logger = prefixLogger('ipc-utils');

export function eachWorker(callback: (worker: cluster.Worker) => any): void {
  if (!cluster.isMaster) return;
  for (const id in cluster.workers) {
    // eslint-disable-next-line node/no-callback-literal
    callback(cluster.workers[id]!);
  }
}

export function registerMasterHandler(event: IPCEvent, handler: IPCMessageHandler): void {
  if (!cluster.isMaster) return;
  logger.debug(`registerMasterHandler for ${event}`);
  eachWorker((worker) => {
    worker.on('message', (message: IPCMessage) => {
      if (message.event !== event) return;
      handler(message);
    });
  });
}

export function registerWorkerHandler(event: IPCEvent, handler: IPCMessageHandler, once = false): void {
  if (!cluster.isWorker) return;
  logger.debug(`registerWorkerHandler for ${event}`);
  const onHandler = (message: IPCMessage): void => {
    if (message.event !== event) return;
    if (once) {
      logger.debug(`deregisterWorkerHandler for ${event}`);
      process.off('message', onHandler);
    }
    handler(message);
  };
  process.on('message', onHandler);
}

export function spreadMessageToWorkers(message: IPCMessage): void {
  if (cluster.isWorker) {
    logger.debug(`spreadMessageToWorkers from worker: ${message.event}`);
    process.send!(message);
  } else {
    logger.debug(`spreadMessageToWorkers from master: ${message.event}`);
    eachWorker((worker) => {
      worker.send(message);
    });
  }
}

const registeredHandlers: Function[] = [];
export function registerHandlers(event: IPCEvent, worker?: IPCMessageHandler, master?: IPCMessageHandler): void {
  const defaultMasterHandler: IPCMessageHandler = (message: IPCMessage): void => {
    spreadMessageToWorkers(message);
  };
  registeredHandlers.push(() => registerMasterHandler(event, master || defaultMasterHandler));
  worker && registeredHandlers.push(() => registerWorkerHandler(event, worker));
}

export function applyRegisteredHandlers(): void {
  logger.debug(`applyRegisteredHandlers`);
  registeredHandlers.forEach((handler) => handler());
  registeredHandlers.splice(0);
}

export async function getConfigFromMaster(): Promise<{ config: Config; [key: string]: any }> {
  const data = await new Promise<{ config: Config; [key: string]: any }>((resolve) => {
    registerWorkerHandler('config', (message) => resolve(message.data), true);
    spreadMessageToWorkers({ event: 'updateConfig', data: undefined });
  });
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete require.cache[require.resolve('@graphql-portal/config')];
  (config as any) = data.config;
  return data;
}

registerHandlers('updateConfig', undefined, async () => {
  const loaded = await loadApiDefs();
  spreadMessageToWorkers({ event: 'config', data: { config, loaded } });
});
