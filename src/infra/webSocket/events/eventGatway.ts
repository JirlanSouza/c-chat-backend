import { Server, Socket } from "socket.io";

import { EventHandler } from "./handlers/types";
import { EventEmitterGatway } from "./EventEmitterGatway";
import { AppEventError } from "@shared/errors/AppEventError";
import { Logger } from "@shared/logger";
import { GetUserRoomIdListQuery } from "@application/chat/queries/GetUserRoomIdList";

type ConnectedUsers = Map<string, string>;
const APP_ERROR_EVENT = "ERROR";

export class SocketIoEventGatway implements EventEmitterGatway {
  private readonly connectedusers: ConnectedUsers;
  private readonly subscribers: Map<string, EventHandler>;

  constructor(
    private readonly socket: Server,
    private readonly getUserRoomIds: GetUserRoomIdListQuery
  ) {
    this.connectedusers = new Map();
    this.subscribers = new Map();
  }

  onEvents(): void {
    this.socket.on("connection", this.userConnected.bind(this));
    this.socket.on("disconnecting", this.userDisconnected.bind(this));
  }

  subscribeEvent(eventName: string, handler: EventHandler): void {
    this.subscribers.set(eventName, handler);
  }

  async userConnected(connection: Socket): Promise<void> {
    const { userId } = connection.handshake as unknown as { userId };
    Logger.info("NEW WEBSOCKET CONNECTION WITH USER_ID :", userId);

    const userRoomIds = await this.getUserRoomIds.execute(userId);
    connection.join(userRoomIds);

    connection.on("disconnecting", this.userDisconnected.bind(this));

    for (const [event] of this.subscribers) {
      connection.on(
        event,
        async (eventData) => await this.onMessage(connection.id, event, eventData)
      );
    }
  }

  async userDisconnected(eventData): Promise<void> {
    console.log(eventData);
  }

  async onMessage(
    connetionId: string,
    eventName: string,
    message: { roomId: string }
  ): Promise<void> {
    const handler = this.subscribers.get(eventName);

    try {
      const eventHandlerResult = await handler(message);

      if (eventHandlerResult.emitAll) {
        this.socket
          .to(message.roomId)
          .emit(eventHandlerResult.emitEventName, eventHandlerResult.data);
      }
    } catch (err) {
      let errorMessage = "Inexpected server error!";
      if (err instanceof AppEventError) {
        errorMessage = err.message;
      }

      const [socket] = await this.socket.in(connetionId).fetchSockets();
      socket.emit(APP_ERROR_EVENT, errorMessage);
      Logger.error(err.message);
    }
  }

  addConnectionUser(socket: Socket, userId: string): void {
    this.connectedusers.set(userId, socket.id);
  }
}
