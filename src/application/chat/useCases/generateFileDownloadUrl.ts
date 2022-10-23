import { AppError } from "@shared/errors/AppError";
import { isValidId } from "@shared/utils/id";
import {
  GenerateFileDowloadUrlInDto,
  GenerateFileDowloadUrlOutDto,
} from "../dtos/GenerateFileDowloadUrlDto";
import { MessageFileRepository } from "../repositories/MessageFileRepository";
import { StorageGatway } from "../storage/StorageGatway";

export class GenerateFileDownloadUrlUseCase {
  constructor(
    private readonly messageFileRepository: MessageFileRepository,
    private readonly storageGatway: StorageGatway
  ) {}

  async execute(data: GenerateFileDowloadUrlInDto): Promise<GenerateFileDowloadUrlOutDto> {
    const isValidFileId = isValidId(data.fileId);

    if (!isValidFileId) {
      throw new AppError("fileId is invalid id!");
    }

    const file = await this.messageFileRepository.findById(data.fileId);

    if (!file) {
      throw new AppError("File does not exists!");
    }

    const userhasAccessToFile = await this.messageFileRepository.findAccessByUserId(
      data.userId,
      file.id
    );

    if (!userhasAccessToFile) {
      throw new AppError("user does not has access to the file!");
    }

    const fileDowloadUrl = await this.storageGatway.generateDownloadUrl(file);
    return { url: fileDowloadUrl };
  }
}
