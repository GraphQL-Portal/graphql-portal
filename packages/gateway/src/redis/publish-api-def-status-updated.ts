import { prefixLogger } from '@graphql-portal/logger';
import { ApiDefStatus, Channel } from '@graphql-portal/types';
import { redis } from './index';

const logger = prefixLogger('redis-publish-api-def-status-updated');
let queue: Array<() => any> = [];

export const publishApiDefStatusUpdated = async (): Promise<void> => {
  try {
    await Promise.all(queue.map(async (publish) => publish()));
  } catch (error) {
    logger.error(`Publish ${Channel.apiDefStatusUpdated} failed. Error: ${error.message}`);
  }
  queue = [];
};

export const enqueuePublishApiDefStatusUpdated = (name: string, status: ApiDefStatus): void => {
  const message = JSON.stringify({
    name,
    status,
  });

  queue.push(redis.publish.bind(redis, Channel.apiDefStatusUpdated, message));
};
