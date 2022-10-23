import { File } from "@domain/entities/File";

export interface StorageGatway {
  save: (file: File, data) => Promise<void>;
  generateDownloadUrl: (file: File) => Promise<string>;
}
