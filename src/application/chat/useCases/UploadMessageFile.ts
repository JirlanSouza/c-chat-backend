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
    const messageFileData = await this.messageFileRepository.findByIdWithOwners(data.fileId);

    if (!messageFileData) {
      throw new AppError("File does not exist!");
    }

    await this.storageGatway.save(messageFileData.file, data.data);
    messageFileData.file.updateAvailable(true);
    await this.messageFileRepository.update(messageFileData.file);

    return {
      roomId: messageFileData.roomId,
      messageId: messageFileData.messageId,
      file: {
        id: messageFileData.file.id,
        name: messageFileData.file.name,
        type: messageFileData.file.type,
        available: messageFileData.file.available,
      },
    };
  }
}
