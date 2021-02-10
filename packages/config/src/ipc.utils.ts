import { registerWorkerHandler } from '@graphql-portal/gateway/src/ipc/utils';
import { Config, config } from './index';

export async function getConfigFromMaster(): Promise<{ config: Config; [key: string]: any }> {
  const data = await new Promise<{ config: Config; [key: string]: any }>((resolve) => {
    registerWorkerHandler('config', (message) => resolve(message.data), true);
  });
  (config as any) = data.config;
  return data;
}
