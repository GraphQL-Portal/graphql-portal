import { prefixLogger } from '@graphql-portal/logger';
import { connections as ConnectionTool, nodeId } from '../server/index';
import redisConnect from '../redis/connect';
import * as ByteTool from '../utils/byte.tool';
import { serializer } from './utils';
import MetricsChannels from './channels.enum';

const logger = prefixLogger('network-metric-recorder');
const networkLogInterval = 1000;

const startPeriodicMetricsRecording = async (redisConnectionString: string): Promise<void> => {
  const redis = await redisConnect(redisConnectionString);
  logger.info('Starting recording network metrics');

  let isRecording = false;

  const hitRecord = async () => {
    if (isRecording) return;

    const connections = await ConnectionTool.get();
    if (!connections) return;

    isRecording = true;

    const data = {
      nodeId,
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

    isRecording = false;
  };

  setInterval(hitRecord, networkLogInterval);
};

export default startPeriodicMetricsRecording;
