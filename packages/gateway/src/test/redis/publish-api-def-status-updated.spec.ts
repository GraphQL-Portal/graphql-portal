import { ApiDefStatus, Channel } from '@graphql-portal/types';
import { redis } from '../../redis';
import {
  publishApiDefStatusUpdated,
  enqueuePublishApiDefStatusUpdated,
} from '../../redis/publish-api-def-status-updated';

jest.mock('../../redis/index', () => ({ redis: { publish: jest.fn() } }));

describe('publishApiDefStatusUpdated', () => {
  it('should call publish with correct arguments', async () => {
    const apiName = 'apiName';

    enqueuePublishApiDefStatusUpdated(apiName, ApiDefStatus.READY);

    await publishApiDefStatusUpdated();

    expect(redis.publish).toHaveBeenCalledTimes(1);
    expect(redis.publish).toHaveBeenCalledWith(
      Channel.apiDefStatusUpdated,
      JSON.stringify({
        name: apiName,
        status: ApiDefStatus.READY,
      })
    );
  });
});
