import { PrismaClient } from "@prisma/client";

import { ChatRepository } from "@application/chat/repositories/ChatRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { AppError } from "@shared/errors/AppError";
import { RoomDto, MessageDto } from "@application/chat/dtos/GetLastRoomMessagesDTO";
import { RoomDto as RoomWithLastMessageDatetimeDto } from "@application/chat/dtos/GetRoomListDTO";
import { Room } from "@domain/entities/Room";
import { Logger } from "@shared/logger";
import { RoomUser } from "@domain/entities/RoomUser";

export class PrismaChatRepository implements ChatRepository {
  private readonly prisma = new PrismaClient();

  async existsRoomById(id: string): Promise<boolean> {
    const room = await this.prisma.room.findUnique({ where: { id } });
    return !!room;
  }

  async findRoomById(roomId: string): Promise<Room> {
    const roomdata = await this.prisma.room.findUnique({ where: { id: roomId } });
    const roomUsersData = await this.prisma.roomUser.findMany({ where: { roomId } });
    const users = await this.prisma.user.findMany({
      where: { id: { in: roomUsersData.map((roomUser) => roomUser.id) } },
    });
    const roomUsers = users.map((user) => {
      return new RoomUser(false, { id: user.id, name: user.name, avatarUrl: user.avatarurl });
    });

    const messagesData = await this.prisma.roomMessage.findMany({ where: { roomId } });
    const roomMessages = messagesData.map((message) => {
      return ChatMessage.from(message.id, message.userId, message.text, message.created);
    });

    const room = Room.from(roomdata.id, roomdata.name, roomdata.avatarUrl, roomUsers, roomMessages);
    return room;
  }

  async saveMessage(roomId: string, message: ChatMessage): Promise<void> {
    const savedMessage = await this.prisma.roomMessage.create({
      data: {
        id: message.id,
        roomId,
        userId: message.userId,
        text: message.text,
        created: message.created,
      },
    });

    if (!savedMessage) {
      throw new AppError("Error when save message", 500);
    }
  }

  async saveRoom(room: Room): Promise<void> {
    const transactionItems = [];
    for (const user of room.usersList) {
      transactionItems.push(
        this.prisma.roomUser.create({
          data: {
            roomId: room.info.id,
            userId: user.userInfo.id,
            isOwner: user.isOwner,
          },
        })
      );
    }

    for (const message of room.messagesList) {
      transactionItems.push(
        this.prisma.roomMessage.create({
          data: {
            id: message.id,
            roomId: room.info.id,
            userId: message.userId,
            text: message.text,
            created: message.created,
          },
        })
      );
    }

    transactionItems.push(
      this.prisma.room.create({
        data: {
          id: room.info.id,
          name: room.info.name,
          avatarUrl: room.info.avatarUrl,
        },
      })
    );

    try {
      await this.prisma.$transaction(transactionItems);
    } catch (err) {
      Logger.error(err);
      throw new AppError("Error when save room", 500);
    }
  }

  async saveUserAtRoom(
    roomId: string,
    roomUser: RoomUser
  ): Promise<RoomWithLastMessageDatetimeDto> {
    const roomUserSaved = await this.prisma.roomUser.create({
      data: { roomId, userId: roomUser.userInfo.id, isOwner: roomUser.isOwner },
    });

    if (!roomUserSaved) {
      throw new AppError("Error to save user in room");
    }

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    const lastRoomMessage = await this.prisma.roomMessage.findFirst({ where: { roomId } });
    return {
      id: room.id,
      name: room.name,
      avatarUrl: room.avatarUrl,
      lastMessageDatetime: lastRoomMessage.created.toLocaleDateString("pt-br"),
    };
  }

  async getRoomByName(name: string): Promise<RoomDto> {
    const room = await this.prisma.room.findUnique({ where: { name } });
    return room;
  }

  async getMessages(roomId: string, dateEnd: number, maxMessage: number): Promise<MessageDto[]> {
    const messages = await this.prisma.roomMessage.findMany({
      where: { roomId },
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: messages.map((message) => message.userId) } },
    });

    const messagesFiles = await this.prisma.messageFile.findMany({
      where: { messageId: { in: messages.map((message) => message.id) } },
    });

    return messages.map((message) => {
      const { id, roomId, text, created } = message;
      const user = users.find((user) => user.id === message.userId);
      const files = messagesFiles
        .filter((file) => file.messageId === id)
        .map((file) => ({
          id: file.id,
          name: file.name,
          type: file.type,
          size: file.size,
          available: file.available,
        }));

      return {
        id,
        roomId,
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarurl,
        },
        text,
        files,
        created: created.toLocaleString("pt-br", { timeZone: "America/Sao_Paulo" }),
      };
    });
  }

  async findRoomByUserId(userId: string): Promise<RoomWithLastMessageDatetimeDto[]> {
    const roomsUsers = await this.prisma.roomUser.findMany({ where: { userId } });
    const roomsId = roomsUsers.map((roomUser) => roomUser.roomId);
    const rooms = await this.prisma.room.findMany({
      where: { id: { in: roomsId } },
    });

    const lastRoomsMessage = await this.prisma.roomMessage.groupBy({
      by: ["roomId", "created"],
      where: { roomId: { in: roomsId } },
    });

    return rooms.map((room) => {
      return {
        ...room,
        lastMessageDatetime: lastRoomsMessage
          .filter((message) => message.roomId === room.id)
          .sort((messageA, messageB) => {
            if (messageA.created.getTime() < messageB.created.getTime()) return 1;
            if (messageA.created.getTime() > messageB.created.getTime()) return -1;
            return 0;
          })[0]
          .created.toLocaleString("pt-br", { timeZone: "America/Sao_Paulo" }),
      };
    });
  }

  async findRoomIdByUserId(userId: string): Promise<string[]> {
    const roomIds = await this.prisma.roomUser.findMany({
      select: {
        roomId: true,
      },
      where: {
        userId,
      },
    });

    return roomIds.map((roomIdObject) => roomIdObject.roomId);
  }
}
