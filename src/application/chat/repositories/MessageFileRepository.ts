import { File } from "@domain/entities/File";

export interface MessageFileRepository {
  saveMany: (messageId: string, files: File[]) => Promise<void>;
  update: (file: File) => Promise<void>;
  findById: (id: string) => Promise<File>;
  findRoomIdById: (id: string) => Promise<string>;
  findAccessByUserId: (userId: string, fileId: string) => Promise<boolean>;
}
