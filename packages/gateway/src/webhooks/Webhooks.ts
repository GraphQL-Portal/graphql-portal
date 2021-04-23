import https from 'https';
import { promisify } from 'util';
import Events, { EventEmitter }  from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef } from '@graphql-portal/types';

export enum WebhookEvents {
  SCHEMA_CHANGED = 'schema_changed'
}

export type Hook = {
  ping: () => Promise<void>;
  url: string;
  event: WebhookEvents;
}

class Webhooks {
  private readonly hooks: {
    [key: string]: { // key equal to api name
      [key: string]: { // key equal to event name
        [key: string]: (() => EventEmitter) | null; // key equal to url, value function that removes event listener
      };
    };
  } = {};

  private readonly emitter = new Events();
  private readonly logger = prefixLogger('webhooks');
  private readonly request = promisify(https.request)

  public static getEventName(apiName: string, event: WebhookEvents, url: string): string {
    return `${apiName}-${event}-${url}`;
  }

  private getApiEvent(apiName: string, event: WebhookEvents): {[key: string]: (() => EventEmitter) | null} {
    const apiHooks = this.hooks[apiName] || (this.hooks[apiName] = {});
    const apiEvent = apiHooks[event] || (apiHooks[event] = {});
    return apiEvent;
  }

  public add(apiName: string, event: WebhookEvents, url: string): void {
    if (!Object.values(WebhookEvents).includes(event)) {
      this.logger.warn(`Unknown event: ${event}, apiName: ${apiName}. Returning...`);
      return;
    }
    
    this.logger.debug(`Adding hook. apiName: ${apiName}, event: ${event}, URL: ${url}`);

    const ping = async (): Promise<void> => {
      try {
        await this.request(url);
      } catch (error) {
        this.logger.error(`Hook error on triggering event: ${event}, url: ${url}, apiName: ${apiName}.\rError: ${error.message}`) ;
      }
    }
    const apiEvent = this.getApiEvent(apiName, event);
    const eventName = Webhooks.getEventName(apiName, event, url);
    
    if (apiEvent[url]) {
      apiEvent[url]!();
    }

    const listener = ping.bind(this);

    apiEvent[url] = (): EventEmitter => this.emitter.removeListener(eventName, listener);

    this.emitter.on(eventName, listener);
  }

  public remove(apiName: string, event: WebhookEvents, url: string): void {
    this.logger.debug(`Removing hook. Event: ${event}, URL: ${url}`);

    const apiEvent = this.getApiEvent(apiName, event);

    if (apiEvent[url]) {
      apiEvent[url]!();
      apiEvent[url] = null;
    }
  }

  public async triggerForApi(apiName: string, event: WebhookEvents): Promise<void> {
    const events = this.getApiEvent(apiName, event);
    const urls = Object.keys(events);

    if (urls.length) {
      this.logger.info(`Triggering events ${event} for api ${apiName}`);
      urls.forEach((url) => this.emitter.emit(Webhooks.getEventName(apiName, event, url)));
    }
  }
}

export let webhooks = new Webhooks();

export const setupWebhooks = (apiDefs: ApiDef[]): void => {
  webhooks = new Webhooks();
  apiDefs.forEach((api) => {
    if (!api.webhooks?.length) return;
    api.webhooks.forEach((({ event, url }) => {
      webhooks.add(api.name, event as WebhookEvents, url)
    }));
  });
}
