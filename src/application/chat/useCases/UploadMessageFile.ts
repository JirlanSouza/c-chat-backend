import { AppError } from "@shared/errors/AppError";
import { UploadMessageFileInDto, UploadMessageFileOutDto } from "../dtos/UploadMessageFileDTO";
import { FileRepository } from "../repositories/FileRepository";
import { StorageGatway } from "../storage/StorageGatway";

export class UploadMessageFileUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly storageGatway: StorageGatway
  ) {}

  async execute(data: UploadMessageFileInDto): Promise<UploadMessageFileOutDto> {
    const file = await this.fileRepository.findById(data.fileId);

    if (!file) {
      throw new AppError("File does not exist!");
    }

    const savedFileUrl = await this.storageGatway.save(file, data.data);

    if (!savedFileUrl) {
      throw new AppError("Error in save file");
    }

    file.updateUrl(savedFileUrl);

    return {
      id: file.id,
      name: file.name,
      type: file.type,
      available: file.available,
      url: file.url,
    };
  }
}
