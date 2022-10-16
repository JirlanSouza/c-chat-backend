import { EventHandler } from "./handlers/types";

export interface EventEmitterGatway {
  userConnected: (connection) => void;
  userDisconnected: (userId: string, eventdata) => void;
  onMessage: (connectionId: string, eventName: string, eventData) => void;
  subscribeEvent: (eventName: string, handler: EventHandler) => void;
  subscribeUserToRoom: (userId: string, roomId: string) => void;
  emitToUser: (userId: string, eventName: string, eventdata) => void;
}
