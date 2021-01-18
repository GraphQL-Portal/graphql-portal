import MetricsChannelsEnum from '../../metric/channels.enum';
import hitRecord from '../../metric/hit-record';
import { serializer } from '../../metric/utils';
import { redis } from '../../redis';
import { connections as connectionsTool } from '../../server';
import * as ByteTool from '../../utils/byte.tool';

jest.mock('@graphql-portal/config', () => ({
  config: {
    nodeId: 'nodeId',
  },
}));
jest.mock('../../redis', () => ({
  redis: {
    lpush: jest.fn(),
  },
}));

describe('hitRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should push data to redis', async () => {
    const connections = 1;
    const bytes = { bytesOut: 1, bytesIn: 3 };
    const spyGetBytesInAndOut = jest.spyOn(ByteTool, 'getBytesInAndOut').mockReturnValue(bytes);
    const spyReset = jest.spyOn(ByteTool, 'reset').mockReturnValue(0);
    const spyGetConnections = jest.spyOn(connectionsTool, 'get').mockResolvedValue(connections);

    const date = 1;
    const spiedDateNow = jest.spyOn(Date, 'now').mockReturnValue(date);
    await hitRecord();

    expect(spyGetConnections).toBeCalledTimes(1);
    expect(spyGetBytesInAndOut).toBeCalledTimes(1);
    expect(spyReset).toBeCalledTimes(1);
    expect(redis.lpush).toBeCalledTimes(1);
    expect(spiedDateNow).toBeCalledTimes(1);
    expect(redis.lpush).toBeCalledWith(
      MetricsChannelsEnum.NETWORK,
      serializer({
        nodeId: 'nodeId',
        network: {
          connections,
          ...bytes,
        },
        date,
      })
    );

    spiedDateNow.mockRestore();
  });

  it('should return if server does not have opened connections', async () => {
    const connections = 0;
    const spyGetConnections = jest.spyOn(connectionsTool, 'get').mockResolvedValue(connections);

    await hitRecord();

    expect(spyGetConnections).toBeCalledTimes(1);
    expect(redis.lpush).toBeCalledTimes(0);
  });
});
