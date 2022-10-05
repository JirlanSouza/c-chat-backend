import { ChatMessage } from "@domain/entities/ChatMessage";
import { Server, Socket } from "socket.io";

import { IEventGatway } from "./IEventGatway";

type ConnectedUsers = Map<string, string>;

const io = new Server();

io.use((socket, next) => {
  socket.handshake.auth.token;
});

export class SocketIoEventGatway implements IEventGatway {
  private connectedusers: ConnectedUsers;

  constructor(private socket: Server) {
    this.connectedusers = new Map();

    this.socket.on("connection", this.userConnected.bind(this));
    this.socket.on("disconnect", this.userDisconnected.bind(this));
  }

  async userConnected(connection: Socket): Promise<void> {
    connection.on("NEW_MESSAGE", this.onMessage.bind(this));
  }

  async userDisconnected(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async onMessage(message: any): Promise<void> {
    const chatMessage = ChatMessage.create(message.userId, message.text);
    this.socket.emit("NEW_MESSAGE", chatMessage);
  }

  async addConnectionUser(socket: Socket, userId: string) {
    this.connectedusers.set(userId, socket.id);
  }
}
