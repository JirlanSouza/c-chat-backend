export interface EventHandlerOut {
  emitAll?: boolean;
  emitOne?: boolean;
  toUserId?: string;
  emitEventName?: string;
  data?: any;
}

export type EventHandler = (eventData: any) => Promise<EventHandlerOut>;
