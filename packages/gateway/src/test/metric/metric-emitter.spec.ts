import { EventEmitter } from 'events';
import { subscribeToRequestMetrics } from '../../metric';
import MetricsChannelsEnum from '../../metric/channels.enum';
import PubSubEventsEnum from '../../metric/pubsub-events.enum';

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
  function EventEmitter() {}
  EventEmitter.prototype.on = jest.fn();
  EventEmitter.prototype.emit = jest.fn();

  return {
    EventEmitter,
  };
});

describe('hitRecord', () => {
  let emitter: EventEmitter;

  beforeAll(() => {
    emitter = new EventEmitter();
  });

  it('should subcsribe on pubsub events', async () => {
    const subscribe = jest.fn();

    await subscribeToRequestMetrics({ subscribe } as any);

    expect(emitter.on).toBeCalledTimes(6);
    expect(emitter.on).toBeCalledTimes(6);
    expect(emitter.on).toHaveBeenNthCalledWith(1, MetricsChannelsEnum.GOT_REQUEST, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(2, MetricsChannelsEnum.RESOLVER_CALLED, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(3, MetricsChannelsEnum.RESOLVER_DONE, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(4, MetricsChannelsEnum.RESOLVER_ERROR, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(5, MetricsChannelsEnum.SENT_RESPONSE, expect.any(Function));
    expect(emitter.on).toHaveBeenNthCalledWith(6, MetricsChannelsEnum.GOT_ERROR, expect.any(Function));

    expect(subscribe).toBeCalledTimes(3);
    expect(subscribe).toHaveBeenNthCalledWith(1, PubSubEventsEnum.RESOLVER_CALLED, expect.any(Function));
    expect(subscribe).toHaveBeenNthCalledWith(2, PubSubEventsEnum.RESOLVER_DONE, expect.any(Function));
    expect(subscribe).toHaveBeenNthCalledWith(3, PubSubEventsEnum.RESOLVER_ERROR, expect.any(Function));
  });
});
