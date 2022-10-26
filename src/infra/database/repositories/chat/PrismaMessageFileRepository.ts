import { PrismaClient } from "@prisma/client";

import {
  MessageFileRepository,
  MessageFileWithOwners,
} from "@application/chat/repositories/MessageFileRepository";
import { File } from "@domain/entities/File";
import { AppError } from "@shared/errors/AppError";

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
      })),
    });
  }

  async update(file: File): Promise<void> {
    await this.prisma.messageFile.update({
      where: { id: file.id },
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        available: file.available,
      },
    });
  }

  async findById(id: string): Promise<File> {
    const fileData = await this.prisma.messageFile.findUnique({ where: { id } });

    if (!fileData) {
      throw new AppError("File does not exist!");
    }

    const file = File.from(
      fileData.id,
      fileData.name,
      fileData.type,
      fileData.size,
      fileData.available
    );
    return file;
  }

  async findByIdWithOwners(id: string): Promise<MessageFileWithOwners> {
    const fileData = await this.prisma.messageFile.findUnique({ where: { id } });

    if (!fileData) {
      throw new AppError("File does not exist!");
    }

    const file = File.from(
      fileData.id,
      fileData.name,
      fileData.type,
      fileData.size,
      fileData.available
    );

    const messageData = await this.prisma.roomMessage.findUnique({
      where: { id: fileData.messageId },
      select: { roomId: true },
    });

    if (!messageData) {
      throw new AppError("Message of file does not exist!");
    }

    return {
      roomId: messageData.roomId,
      messageId: fileData.messageId,
      file,
    };
  }

  async findRoomIdById(id: string): Promise<string> {
    const messageFile = await this.prisma.messageFile.findUnique({
      where: { id },
      select: { messageId: true },
    });

    if (!messageFile) {
      throw new AppError("File does not exist!");
    }

    const roomMessage = await this.prisma.roomMessage.findUnique({
      where: { id: messageFile.messageId },
      select: { roomId: true },
    });

    if (!roomMessage) {
      throw new AppError("file message does not exist!");
    }

    return roomMessage.roomId;
  }

  async findAccessByUserId(userId: string, fileId: string): Promise<boolean> {
    const messageFile = await this.prisma.messageFile.findUnique({
      where: { id: fileId },
      select: { messageId: true },
    });

    if (!messageFile) {
      throw new AppError("File does not exist!");
    }

    const roomMessage = await this.prisma.roomMessage.findUnique({
      where: { id: messageFile.messageId },
      select: { roomId: true },
    });

    if (!roomMessage) {
      throw new AppError("file message does not exist!");
    }

    const roomUserCount = await this.prisma.roomUser.count({
      where: { roomId: roomMessage.roomId, userId },
    });

    if (!roomUserCount) {
      return false;
    }

    return true;
  }
}
