import { PrismaClient } from "@prisma/client";

import { MessageFileRepository } from "@application/chat/repositories/MessageFileRepository";
import { File } from "@domain/entities/File";

export class PrismaMessageFileRepository implements MessageFileRepository {
  private readonly prisma = new PrismaClient();

  async saveMany(messageId: string, files: File[]): Promise<void> {
    await this.prisma.messageFile.createMany({
      data: files.map((file) => ({
        id: file.id,
        messageId,
        name: file.name,
        type: file.type,
        size: file.size,
        available: file.available,
        url: file.url,
      })),
    });
  }

  async findById(id: string): Promise<File> {
    const fileData = await this.prisma.messageFile.findUnique({ where: { id } });
    const file = File.from(
      fileData.id,
      fileData.name,
      fileData.type,
      fileData.size,
      fileData.available,
      fileData.url
    );
    return file;
  }
}
