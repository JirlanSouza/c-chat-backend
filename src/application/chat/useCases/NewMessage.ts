import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { MessageFileOutData, NewMessageInDto, NewMessageOutDto } from "../dtos/NewMessageTDO";
import { ChatRepository } from "../repositories/ChatRepository";
import { AppError } from "@shared/errors/AppError";
import { MessageFileRepository } from "../repositories/MessageFileRepository";
import { File } from "@domain/entities/File";

export class NewMessageUseCase {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly fileRepository: MessageFileRepository,
    private readonly usersRepositoty: UsersRepository
  ) {}

  async execute(data: NewMessageInDto): Promise<NewMessageOutDto> {
    const existsRoom = await this.chatRepository.existsRoomById(data.roomId);

    if (!existsRoom) {
      throw new AppError("Room does not exists!");
    }

    const user = await this.usersRepositoty.findById(data.userId);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const message = ChatMessage.create(data.userId, data.text);
    await this.chatRepository.saveMessage(data.roomId, message);

    let filesResult: MessageFileOutData[];

    if (!!data.files && data.files.length) {
      const files: File[] = [];
      for (const fileData of data.files) {
        const file = File.create(fileData.name, fileData.type, fileData.size);
        files.push(file);
      }

      await this.fileRepository.saveMany(message.id, files);

      filesResult = files.map((file) => {
        return {
          id: file.id,
          name: file.name,
          type: file.type,
          available: file.available,
        };
      });
    }

    return {
      id: message.id,
      roomId: data.roomId,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      text: message.text,
      files: filesResult,
      created: message.created.toLocaleString("pt-br"),
    };
  }
}
