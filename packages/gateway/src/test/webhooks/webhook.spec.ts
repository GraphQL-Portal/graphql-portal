import { EventEmitter } from 'events';
import { setupWebhooks, webhooks, Webhooks } from '../../webhooks';
import { WebhookEvent } from '@graphql-portal/types';

jest.mock('events', () => {
  const events = jest.requireActual('events');

  events.prototype.on = jest.fn();
  events.prototype.emit = jest.fn();
  events.prototype.removeListener = jest.fn();

  return events;
});

describe('Webhooks', () => {
  let emitter: EventEmitter;
  const url = 'https://example.com';
  const anotherUrl = 'https://example.com/2';
  const apiName = 'api';
  const event = WebhookEvent.SCHEMA_CHANGED;
  const hooks = [
    {
      url,
      event,
    },
    {
      url: anotherUrl,
      event,
    },
  ];

  beforeAll(() => {
    jest.clearAllMocks();
    emitter = new EventEmitter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setupWebhooks', () => {
    it('should call emitter.on', () => {
      setupWebhooks([
        {
          name: apiName,
          webhooks: hooks,
        },
      ] as any);

      expect(emitter.on).toBeCalledTimes(hooks.length);
    });
  });

  describe('add', () => {
    it('should remove previous listener and set the new one', () => {
      webhooks.add(apiName, event, url);

      expect(emitter.removeListener).toBeCalledTimes(1);
      expect(emitter.on).toBeCalledTimes(1);
    });
  });

  describe('trigger', () => {
    it('should call emit for each hook', () => {
      webhooks.triggerForApi(apiName, event);

      expect(emitter.emit).toBeCalledTimes(2);
      expect(emitter.emit).nthCalledWith(1, Webhooks.getEventName(apiName, event, url));
      expect(emitter.emit).nthCalledWith(2, Webhooks.getEventName(apiName, event, anotherUrl));
    });
  });

  describe('remove', () => {
    it('should call remove eventListener for specific hook', () => {
      webhooks.remove(apiName, event, anotherUrl);

      expect(emitter.removeListener).toBeCalledTimes(1);
      expect(emitter.removeListener).toBeCalledWith(
        Webhooks.getEventName(apiName, event, anotherUrl),
        expect.any(Function)
      );
    });
  });
});
