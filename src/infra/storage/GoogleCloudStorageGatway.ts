import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import { StorageGatway } from "@application/chat/storage/StorageGatway";
import { File } from "@domain/entities/File";
import { Bucket } from "@google-cloud/storage";
import { AppError } from "@shared/errors/AppError";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require(process.env.STORAGE_SEVICE_ACOOUNT);

export class GoogleCloudStorageGatway implements StorageGatway {
  private readonly storageBucket: Bucket;
  constructor() {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.STORAGE_BUCKET,
    });

    this.storageBucket = getStorage().bucket();
  }

  async save(file: File, data): Promise<string> {
    const storageFileName = file.id + file.name;
    const storageFile = this.storageBucket.file(storageFileName);

    try {
      await storageFile.save(data, { contentType: file.type, public: true });
      return storageFile.publicUrl();
    } catch {
      throw new AppError("Error in save file to storage");
    }
  }
}
