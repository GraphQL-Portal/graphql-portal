import { config } from '@graphql-portal/config';
import { MetricsChannels } from '@graphql-portal/types';
import { prefixLogger } from '@graphql-portal/logger';
import { redis } from '../redis';
import { connections as ConnectionTool } from '../server/index';
import * as ByteTool from '../utils/byte.tool';
import { serializer } from './utils';

const logger = prefixLogger('analytics:hit-record');

const hitRecord = async (): Promise<void> => {
  const connections = await ConnectionTool.get();
  if (!connections) return;

  const data = {
    nodeId: config.nodeId,
    network: {
      connections,
      ...ByteTool.getBytesInAndOut(),
    },
    date: Date.now(),
  };
  ByteTool.reset();
  try {
    await redis.lpush(MetricsChannels.NETWORK, serializer(data));
  } catch (error) {
    logger.error(`Couldn't write to ${MetricsChannels.NETWORK}: \n${error.toString()}`);
  }
};

export default hitRecord;
