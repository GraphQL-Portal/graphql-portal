import { EventEmitter } from 'events';
import { subscribeToRequestMetrics } from '../../metric';
import { MetricsChannels, PubSubEvents } from '@graphql-portal/types';

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
jest.mock('events', () => {
  const events = jest.requireActual('events');

  events.prototype.on = jest.fn();
  events.prototype.emit = jest.fn();
  events.prototype.listenerCount = jest.fn();

  return events;
});

describe('hitRecord', () => {
  let emitter: EventEmitter;

  beforeAll(() => {
    emitter = new EventEmitter();
  });

  it('should subcsribe on pubsub events', async () => {
    const subscribe = jest.fn();
    ((emitter.on as any) as jest.SpyInstance).mockClear();
    await subscribeToRequestMetrics({ subscribe } as any);

    expect(emitter.on).toBeCalledTimes(6);
    expect(emitter.on).toHaveBeenNthCalledWith(1, MetricsChannels.GOT_REQUEST, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(2, MetricsChannels.RESOLVER_CALLED, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(3, MetricsChannels.RESOLVER_DONE, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(4, MetricsChannels.RESOLVER_ERROR, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(5, MetricsChannels.SENT_RESPONSE, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(6, MetricsChannels.GOT_ERROR, expect.any(Function));

    expect(subscribe).toBeCalledTimes(3);
    expect(subscribe).toHaveBeenNthCalledWith(1, PubSubEvents.RESOLVER_CALLED, expect.any(Function));
    expect(subscribe).toHaveBeenNthCalledWith(2, PubSubEvents.RESOLVER_DONE, expect.any(Function));
    expect(subscribe).toHaveBeenNthCalledWith(3, PubSubEvents.RESOLVER_ERROR, expect.any(Function));
  });
});
