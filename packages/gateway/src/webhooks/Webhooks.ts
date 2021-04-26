import https from 'https';
import { promisify } from 'util';
import Events from 'events';
import { prefixLogger } from '@graphql-portal/logger';
import { ApiDef, WebhookEvent } from '@graphql-portal/types';

export type RemoveEventListener = (() => void) | null;

export class Webhooks {
  private readonly hooks: {
    [apiName: string]: {
      // key equal to api name
      [eventName: string]: {
        // key equal to event name
        [url: string]: RemoveEventListener; // key equal to url
      };
    };
  } = {};

  private readonly emitter = new Events();
  private readonly logger = prefixLogger('webhooks');
  private readonly request = promisify(https.request);

  public static getEventName(apiName: string, event: WebhookEvent, url: string): string {
    return `${apiName}-${event}-${url}`;
  }

  private getApiEventHooks(apiName: string, event: WebhookEvent): { [key: string]: RemoveEventListener } {
    const apiHooks = this.hooks[apiName] || (this.hooks[apiName] = {});
    const apiEventHooks = apiHooks[event] || (apiHooks[event] = {});
    return apiEventHooks;
  }

  public add(apiName: string, event: WebhookEvent, url: string): void {
    if (!Object.values(WebhookEvent).includes(event)) {
      this.logger.warn(`Unknown event: ${event}, apiName: ${apiName}. Returning...`);
      return;
    }

    this.logger.debug(`Adding hook. apiName: ${apiName}, event: ${event}, URL: ${url}`);

    const ping = async (): Promise<void> => {
      try {
        await this.request(url);
      } catch (error) {
        this.logger.error(
          `Hook error on triggering event: ${event}, url: ${url}, apiName: ${apiName}.\rError: ${error.message}`
        );
      }
    };
    const apiEventHooks = this.getApiEventHooks(apiName, event);
    const eventName = Webhooks.getEventName(apiName, event, url);

    if (apiEventHooks[url]) {
      apiEventHooks[url]!();
    }

    const listener = ping.bind(this);

    apiEventHooks[url] = (): void => {
      this.emitter.removeListener(eventName, listener);
    };

    this.emitter.on(eventName, listener);
  }

  public remove(apiName: string, event: WebhookEvent, url: string): void {
    this.logger.debug(`Removing hook. Event: ${event}, URL: ${url}`);

    const apiEventHooks = this.getApiEventHooks(apiName, event);

    if (apiEventHooks[url]) {
      apiEventHooks[url]!();
      apiEventHooks[url] = null;
    }
  }

  public async triggerForApi(apiName: string, event: WebhookEvent): Promise<void> {
    const events = this.getApiEventHooks(apiName, event);
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
    api.webhooks.forEach(({ event, url }) => {
      webhooks.add(api.name, event as WebhookEvent, url);
    });
  });
};
