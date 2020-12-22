import setupRedis from '../../redis';
import mockConnect from '../../redis/connect';
import { ping as mockPing } from '../../redis/ping';

jest.mock('../../redis/connect', () =>
  jest
    .fn()
    .mockResolvedValue({ publisher: true })
    .mockReturnValueOnce({ publisher: false })
);

jest.mock('../../redis/ping', () => ({
  ping: jest
    .fn()
    .mockResolvedValue({ publisher: true })
    .mockReturnValueOnce({ publisher: false }),
}));

describe('Redis', () => {
  describe('setupRedis', () => {
    const connectionString = 'redis://localhost:6379';

    it('should call connect with given connectionString, ping with the publisher and return the subscriber', async () => {
      const result = await setupRedis(connectionString);

      expect(mockConnect).toHaveBeenCalledTimes(2);
      expect(mockConnect).toHaveBeenCalledWith(connectionString);
      expect(mockPing).toHaveBeenCalledTimes(1);
      expect(mockPing).toHaveBeenCalledWith({ publisher: true });
      expect(result).toMatchObject({ publisher: false });
    });
  });
});
