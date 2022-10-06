import { EventHandler } from "./handlers/types";

export interface EventEmitterGatway {
  userConnected(connection: any): Promise<void>;
  userDisconnected(eventdata: any): Promise<void>;
  onMessage(connectionId: string, eventName: string, eventData: any): Promise<void>;
  subscribeEvent(eventName: string, handler: EventHandler);
}
