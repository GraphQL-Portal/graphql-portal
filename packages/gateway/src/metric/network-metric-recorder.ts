import { prefixLogger } from '@graphql-portal/logger';
import { config } from '@graphql-portal/config';
import { connections as ConnectionTool } from '../server/index';
import { getRedisClient } from '../redis';
import * as ByteTool from '../utils/byte.tool';
import { serializer } from './utils';
import MetricsChannels from './channels.enum';

const logger = prefixLogger('network-metric-recorder');
const networkLogInterval = 1000;

let interval: NodeJS.Timeout;

const startPeriodicMetricsRecording = async (): Promise<void> => {
  if (interval) clearInterval(interval);

  const redis = await getRedisClient();
  logger.info('Starting recording network metrics');

  const hitRecord = async () => {
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
    try {
      await redis.lpush(MetricsChannels.NETWORK, serializer(data));
      ByteTool.reset();
    } catch (error) {
      logger.error(`Couldn't write to ${MetricsChannels.NETWORK}: \n${error.toString()}`);
    }
  };

  interval = setInterval(hitRecord, networkLogInterval);
};

export default startPeriodicMetricsRecording;
