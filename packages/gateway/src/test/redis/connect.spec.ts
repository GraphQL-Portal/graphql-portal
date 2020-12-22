import { EventEmitter } from 'events';
import connect from '../../redis/connect';

let redisClient: EventEmitter;

jest.mock(
  'ioredis',
  () =>
    class RedisMock extends EventEmitter {
      constructor(public connectionString: string) {
        super();
        redisClient = this;
      }
    }
);

describe('Redis', () => {
  describe('connect', () => {
    const connectionString = 'redis://localhost:6379';

    it('should create an instance of redis client and wait for connect event before resolving the promise', async () => {
      const promise = connect(connectionString);
      redisClient.emit('connect');
      const result = await promise;

      expect(result).toBe(redisClient);
      expect((result as any).connectionString).toBe(connectionString);
    });
  });
});
