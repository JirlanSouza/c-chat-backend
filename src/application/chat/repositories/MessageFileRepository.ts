import { File } from "@domain/entities/File";

export interface MessageFileRepository {
  saveMany: (messageId: string, files: File[]) => Promise<void>;
  findById: (id: string) => Promise<File>;
  update: (file: File) => Promise<void>;
}
