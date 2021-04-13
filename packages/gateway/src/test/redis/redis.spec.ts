import setupRedis from '../../redis';
import mockConnect from '../../redis/connect';
import { ping as mockPing } from '../../redis/ping';

jest.mock('../../redis/connect', () =>
  jest.fn().mockResolvedValue({ publisher: true }).mockReturnValueOnce({ publisher: false })
);

jest.mock('../../redis/ping', () => ({
  ping: jest.fn().mockResolvedValue({ publisher: true }).mockReturnValueOnce({ publisher: false }),
}));

describe('Redis', () => {
  describe('setupRedis', () => {
    const options = { connection_string: 'redis://localhost:6379' };

    it('should call connect with given options, ping with the publisher and return the subscriber', async () => {
      const result = await setupRedis(options);

      expect(mockConnect).toHaveBeenCalledTimes(2);
      expect(mockConnect).toHaveBeenCalledWith(options, undefined);
      expect(mockPing).toHaveBeenCalledTimes(1);
      expect(mockPing).toHaveBeenCalledWith({ publisher: true });
      expect(result).toMatchObject({ publisher: false });
    });
  });
});
