import { PrismaClient } from "@prisma/client";

import { ChatRepository } from "@application/chat/repositories/ChatRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { AppError } from "@shared/errors/AppError";
import { RoomDto, MessageDto } from "@application/chat/dtos/GetLastRoomMessagesDTO";

export class PrismaChatRepository implements ChatRepository {
  private prisma = new PrismaClient();

  async existsRoomById(id: string): Promise<boolean> {
    const room = await this.prisma.room.findUnique({ where: { id } });
    return !!room;
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

  async getRoomByTitle(title: string): Promise<RoomDto> {
    const room = await this.prisma.room.findUnique({ where: { title } });
    return room;
  }

  async getMessages(roomId: string, dateEnd: number, maxMessage: number): Promise<MessageDto[]> {
    const messages = await this.prisma.roomMessage.findMany({
      where: { roomId },
    });

    return messages.map((message) => {
      return {
        ...message,
        created: message.created.toLocaleString("pt-br", { timeZone: "America/Sao_Paulo" }),
      };
    });
  }
}
