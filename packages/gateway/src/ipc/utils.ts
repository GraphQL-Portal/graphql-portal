import cluster from 'cluster';
import { IPCEvent, IPCMessage, IPCMessageHandler } from './ipc-message.interface';
import { prefixLogger } from '@graphql-portal/logger';

const logger = prefixLogger('ipc-utils');

export function eachWorker(callback: (worker: cluster.Worker) => any) {
  if (!cluster.isMaster) return;
  for (const id in cluster.workers) {
    callback(cluster.workers[id]!);
  }
}

export function registerMasterHandler(event: IPCEvent, handler: IPCMessageHandler) {
  if (!cluster.isMaster) return;
  logger.debug(`registerMasterHandler for ${event}`);
  eachWorker((worker) => {
    worker.on('message', (message: IPCMessage) => {
      if (message.event !== event) return;
      handler(message);
    });
  });
}

export function registerWorkerHandler(event: IPCEvent, handler: IPCMessageHandler) {
  if (!cluster.isWorker) return;
  logger.debug(`registerWorkerHandler for ${event}`);
  process.on('message', (message: IPCMessage) => {
    if (message.event !== event) return;
    handler(message);
  });
}

export function spreadMessageToWorkers(message: IPCMessage) {
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
export function registerHandlers(event: IPCEvent, worker: IPCMessageHandler) {
  const defaultMasterHandler: IPCMessageHandler = (message: IPCMessage): void => {
    spreadMessageToWorkers(message);
  };
  registeredHandlers.push(
    () => registerMasterHandler(event, defaultMasterHandler),
    () => registerWorkerHandler(event, worker)
  );
}

export function applyRegisteredHandlers() {
  logger.debug(`applyRegisteredHandlers`);
  registeredHandlers.forEach((handler) => handler());
  registeredHandlers.splice(0);
}
