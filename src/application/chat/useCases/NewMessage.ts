import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { NewMessageInDto, NewMessageOutDto } from "../dtos/NewMessageTDO";
import { ChatRepository } from "../repositories/ChatRepository";
import { AppError } from "@shared/errors/AppError";

export class NewMessageUseCase {
  constructor(private readonly chatRepository: ChatRepository, private readonly usersRepositoty: UsersRepository) {}

  async execute(data: NewMessageInDto): Promise<NewMessageOutDto> {
    const existsRoom = await this.chatRepository.existsRoomById(data.roomId);

    if (!existsRoom) {
      throw new AppError("Room does not exists!");
    }

    const existsUser = await this.usersRepositoty.findById(data.userId);

    if (!existsUser) {
      throw new AppError("user does not exists!");
    }

    const message = ChatMessage.create(data.userId, data.text);
    this.chatRepository.saveMessage(data.roomId, message);
    return { ...message, roomId: data.roomId, created: message.created.toLocaleString("pt-br") };
  }
}
