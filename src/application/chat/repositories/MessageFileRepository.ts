import { File } from "@domain/entities/File";

export interface MessageFileWithOwners {
  roomId: string;
  messageId: string;
  file: File;
}

export interface MessageFileRepository {
  saveMany: (messageId: string, files: File[]) => Promise<void>;
  update: (file: File) => Promise<void>;
  findById: (id: string) => Promise<File>;
  findByIdWithOwners: (id: string) => Promise<MessageFileWithOwners>;
  findRoomIdById: (id: string) => Promise<string>;
  findAccessByUserId: (userId: string, fileId: string) => Promise<boolean>;
}
