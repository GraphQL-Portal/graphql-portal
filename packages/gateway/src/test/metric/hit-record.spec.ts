import hitRecord from '../../metric/hit-record';
import * as ByteTool from '../../utils/byte.tool';
import { connections as connectionsTool } from '../../server';
import { redis } from '../../redis';
import { serializer } from '../../metric/utils';
import MetricsChannelsEnum from '../../metric/channels.enum';

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
    const olDateNow = Date.now;
    const newDateNow = jest.fn(() => date);
    Date.now = newDateNow;
    await hitRecord();
    Date.now = olDateNow;

    expect(spyGetConnections).toBeCalledTimes(1);
    expect(spyGetBytesInAndOut).toBeCalledTimes(1);
    expect(spyReset).toBeCalledTimes(1);
    expect(redis.lpush).toBeCalledTimes(1);
    expect(newDateNow).toBeCalledTimes(1);
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
  });
  it('should return in server does not have opened connections', async () => {
    const connections = 0;
    const spyGetConnections = jest.spyOn(connectionsTool, 'get').mockResolvedValue(connections);

    await hitRecord();

    expect(spyGetConnections).toBeCalledTimes(1);
    expect(redis.lpush).toBeCalledTimes(0);
  });
});
