export interface EventHandlerOut {
  emitAll?: boolean;
  emitOne?: boolean;
  toUserId?: string;
  emitEventName?: string;
  data?: unknown;
}

export type EventHandler = (eventData) => Promise<EventHandlerOut>;
