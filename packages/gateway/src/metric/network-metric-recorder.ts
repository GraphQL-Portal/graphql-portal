import { prefixLogger } from '@graphql-portal/logger';
import hitRecord from './hit-record';

const logger = prefixLogger('analytics:network-metric-recorder');
const networkLogInterval = 1000;

let interval: NodeJS.Timeout;

const startPeriodicMetricsRecording = (): void => {
  if (interval) clearInterval(interval);

  logger.info('Starting recording network metrics');

  interval = setInterval(hitRecord, networkLogInterval);
};

export default startPeriodicMetricsRecording;
