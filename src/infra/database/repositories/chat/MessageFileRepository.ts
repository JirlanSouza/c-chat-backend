import {
  MessageFileRepository,
  MessageFileWithOwners,
} from "@application/chat/repositories/MessageFileRepository";
import { File } from "@domain/entities/File";

export class MessageFileInMemoryRepository implements MessageFileRepository {
  async saveMany(messageId: string, files: File[]): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async update(file: File): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<File> {
    throw new Error("Method not implemented.");
  }

  async findByIdWithOwners(id: string): Promise<MessageFileWithOwners> {
    throw new Error("Method not implemented.");
  }

  async findRoomIdById(id: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async findAccessByUserId(userId: string, fileId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
