import { ping } from '../../redis/ping';

jest.useFakeTimers();

describe('Redis', () => {
  describe('ping', () => {
    it('should call redis.publish each 5 seconds', async () => {
      const redisMock = { publish: jest.fn() };
      ping(redisMock as any);
      expect(redisMock.publish).toHaveBeenCalledTimes(0);
      jest.advanceTimersByTime(5000);
      expect(redisMock.publish).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(5000);
      expect(redisMock.publish).toHaveBeenCalledTimes(2);
    });
  });
});
