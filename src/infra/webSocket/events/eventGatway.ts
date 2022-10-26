import { Server, Socket } from "socket.io";

import { EventHandler } from "./handlers/types";
import { EventEmitterGatway } from "./EventEmitterGatway";
import { AppEventError } from "@shared/errors/AppEventError";
import { Logger } from "@shared/logger";
import { GetUserRoomIdListQuery } from "@application/chat/queries/GetUserRoomIdList";

type ConnectedUsers = Map<string, string>;
const APP_ERROR_EVENT = "ERROR";

export class SocketIoEventGatway implements EventEmitterGatway {
  private readonly connectedUsers: ConnectedUsers;
  private readonly subscribers: Map<string, EventHandler>;

  constructor(
    private readonly socket: Server,
    private readonly getUserRoomIds: GetUserRoomIdListQuery
  ) {
    this.connectedUsers = new Map();
    this.subscribers = new Map();
  }

  subscribeUserToRoom: (userId: string, roomId: string) => void;

  onEvents(): void {
    this.socket.on("connection", this.userConnected.bind(this));
  }

  subscribeEvent(eventName: string, handler: EventHandler): void {
    this.subscribers.set(eventName, handler);
  }

  async userConnected(connection: Socket): Promise<void> {
    const { userId } = connection.handshake as unknown as { userId };
    this.connectedUsers.set(userId, connection.id);

    Logger.info("NEW WEBSOCKET CONNECTION WITH USER_ID :", userId);

    connection.on(
      "disconnecting",
      async (eventData) => await this.userDisconnected(userId, eventData)
    );

    for (const [event] of this.subscribers) {
      connection.on(
        event,
        async (eventData) => await this.onMessage(connection.id, event, eventData)
      );
    }

    const userRoomIds = await this.getUserRoomIds.execute(userId);
    await connection.join(userRoomIds);
  }

  async userDisconnected(userId: string, eventData): Promise<void> {
    this.connectedUsers.delete(userId);
    Logger.info(eventData);
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
        Logger.info("EMITING: ", eventHandlerResult.emitEventName);
        this.socket
          .in(message.roomId)
          .emit(eventHandlerResult.emitEventName, eventHandlerResult.data);
      }
    } catch (err) {
      let errorMessage = "Inexpected server error!";
      if (err instanceof AppEventError) {
        errorMessage = err.message;
      }

      const [socket] = await this.socket.in(connetionId).fetchSockets();
      socket.emit(APP_ERROR_EVENT, errorMessage);
      Logger.error(err);
    }
  }

  emitToUser(userId: string, eventName: string, eventdata): void {
    if (!this.connectedUsers.has(userId)) {
      return;
    }

    const userConnectionId = this.connectedUsers.get(userId);
    this.socket.to(userConnectionId).emit(eventName, eventdata);
  }

  addConnectionUser(socket: Socket, userId: string): void {
    this.connectedUsers.set(userId, socket.id);
  }
}
