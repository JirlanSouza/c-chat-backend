import { Server, Socket } from "socket.io";
import { EventHandler } from "./handlers/types";

import { EventEmitterGatway } from "./EventEmitterGatway";
import { Logger } from "@shared/logger";

type ConnectedUsers = Map<string, string>;

export class SocketIoEventGatway implements EventEmitterGatway {
  private connectedusers: ConnectedUsers;
  private subscribers: Map<string, EventHandler>;
  private connectEventSubscribers: Map<string, EventHandler>;
  private disconnectEventSubscribers: Map<string, EventHandler>;
  private errorEventSubscribers: Map<string, EventHandler>;

  constructor(private socket: Server) {
    this.connectedusers = new Map();
    this.subscribers = new Map();
    this.connectEventSubscribers = new Map();
    this.disconnectEventSubscribers = new Map();
    this.errorEventSubscribers = new Map();
  }

  async onEvents() {
    this.socket.on("connection", this.userConnected.bind(this));
    this.socket.on("disconnecting", this.userDisconnected.bind(this));
  }

  subscribeEvent(eventName: string, handler: EventHandler) {
    this.subscribers.set(eventName, handler);
  }

  async userConnected(connection: Socket): Promise<void> {
    Logger.info("NEW WEBSOCKET CONNECTION ID :", connection.id);

    connection.on("disconnecting", this.userDisconnected.bind(this));

    for (let [event] of this.subscribers) {
      connection.on(event, ((eventData) => this.onMessage(event, eventData)).bind(this));
    }
  }

  async userDisconnected(eventData: any): Promise<void> {
    console.log(eventData);
  }

  async onMessage(eventName: string, message: any): Promise<void> {
    const handler = this.subscribers.get(eventName);
    const eventHandlerResult = await handler(message);

    if (eventHandlerResult.emitAll) {
      this.socket.emit(eventHandlerResult.emitEventName, eventHandlerResult.data);
    }
  }

  async addConnectionUser(socket: Socket, userId: string) {
    this.connectedusers.set(userId, socket.id);
  }
}
