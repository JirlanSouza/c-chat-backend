import { EventHandler } from "./handlers/types";

export interface EventEmitterGatway {
  userConnected: (connection) => void;
  userDisconnected: (eventdata) => void;
  onMessage: (connectionId: string, eventName: string, eventData) => void;
  subscribeEvent: (eventName: string, handler: EventHandler) => void;
}
