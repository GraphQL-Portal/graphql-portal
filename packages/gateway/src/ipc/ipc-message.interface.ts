export type IPCEvent = 'config' | 'updateApi' | 'updateConfig';

export interface IPCMessage {
  event: IPCEvent;
  data: any;
}

export type IPCMessageHandler = (message: IPCMessage) => any;
