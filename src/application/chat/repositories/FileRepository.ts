import { File } from "@domain/entities/File";

export interface FileRepository {
  saveMany: (messageId: string, files: File[]) => Promise<void>;
  findById: (id: string) => Promise<File>;
}
