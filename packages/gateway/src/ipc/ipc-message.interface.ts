export type IPCEvent = 'config' | 'updateApi' | 'updateConfig' | 'invalidateCache';

export interface IPCMessage {
  event: IPCEvent;
  data: any;
}

export type IPCMessageHandler = (message: IPCMessage) => any;
