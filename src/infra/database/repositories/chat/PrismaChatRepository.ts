import { PrismaClient } from "@prisma/client";

import { ChatRepository } from "@application/chat/repositories/ChatRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { AppError } from "@shared/errors/AppError";

export class PrismaChatRepository implements ChatRepository {
  private prisma = new PrismaClient();

  async existsRoomById(id: string): Promise<boolean> {
    const room = await this.prisma.room.findUnique({ where: { id } });
    return !!room;
  }

  async saveMessage(roomId: string, message: ChatMessage): Promise<void> {
    const savedMessage = this.prisma.roomMessage.create({
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
}
