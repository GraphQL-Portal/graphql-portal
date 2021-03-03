import { EventEmitter } from 'events';
import connect from '../../redis/connect';

let redisClient: EventEmitter;

jest.mock(
  'ioredis',
  () =>
    class RedisMock extends EventEmitter {
      public constructor(public connectionString: string) {
        super();
        redisClient = this;
      }
    }
);

describe('Redis', () => {
  describe('connect', () => {
    const options = { connection_string: 'redis://localhost:6379', is_cluster: false };

    it('should create an instance of redis client and wait for connect event before resolving the promise', async () => {
      const promise = connect(options);
      redisClient.emit('connect');
      const result = await promise;

      expect(result).toBe(redisClient);
      expect((result as any).connectionString).toStrictEqual(options.connection_string);
    });
  });
});
