import { AppError } from "@shared/errors/AppError";
import { UploadMessageFileInDto, UploadMessageFileOutDto } from "../dtos/UploadMessageFileDTO";
import { MessageFileRepository } from "../repositories/MessageFileRepository";
import { StorageGatway } from "../storage/StorageGatway";

export class UploadMessageFileUseCase {
  constructor(
    private readonly messageFileRepository: MessageFileRepository,
    private readonly storageGatway: StorageGatway
  ) {}

  async execute(data: UploadMessageFileInDto): Promise<UploadMessageFileOutDto> {
    const file = await this.messageFileRepository.findById(data.fileId);

    if (!file) {
      throw new AppError("File does not exist!");
    }

    await this.storageGatway.save(file, data.data);
    file.updateAvailable(true);
    await this.messageFileRepository.update(file);

    return {
      id: file.id,
      name: file.name,
      type: file.type,
      available: file.available,
    };
  }
}
