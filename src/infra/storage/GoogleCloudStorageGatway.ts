import { resolve } from "path";
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

import { StorageGatway } from "@application/chat/storage/StorageGatway";
import { File } from "@domain/entities/File";
import { Bucket } from "@google-cloud/storage";
import { AppError } from "@shared/errors/AppError";
import { Logger } from "@shared/logger";

const serviceAccountFilePath =
  process.env.NODE_ENV === "development"
    ? resolve(process.env.STORAGE_SERVICE_ACCOUNT)
    : process.env.STORAGE_SERVICE_ACCOUNT;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = JSON.parse(readFileSync(serviceAccountFilePath).toString());

export class GoogleCloudStorageGatway implements StorageGatway {
  private readonly storageBucket: Bucket;
  constructor() {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.STORAGE_BUCKET,
    });

    this.storageBucket = getStorage().bucket();
  }

  async save(file: File, data): Promise<void> {
    const storageFileName = this.generateFileName(file);
    const storageFile = this.storageBucket.file(storageFileName);

    try {
      await storageFile.save(data, { contentType: file.type, private: true });
    } catch (err) {
      Logger.warn(err);
      throw new AppError("Error in save file to storage", 500);
    }
  }

  async generateDownloadUrl(file: File): Promise<string> {
    const storageFileName = this.generateFileName(file);
    const storageFile = this.storageBucket.file(storageFileName);

    try {
      const urlExpiresDate = Date.now() + 5 * 60 * 1000;
      const [url] = await storageFile.getSignedUrl({ action: "read", expires: urlExpiresDate });
      return url;
    } catch (err) {
      Logger.warn(err);
      new AppError("Error on generate file url download!", 500);
    }
  }

  private generateFileName(file: File): string {
    const folder = file.type.split("/")[0] || "common";
    const storageEnvFolder = process.env.STORAGE_ENV || "dev";
    const storageFileName = `${storageEnvFolder}/${folder}/${file.id}_${file.name}`;
    return storageFileName;
  }
}
