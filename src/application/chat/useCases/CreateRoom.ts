import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { Room } from "@domain/entities/Room";
import { AppError } from "@shared/errors/AppError";
import { CreateRoomInDto, CreateRoomOutDto } from "../dtos/CreateRoomDTO";
import { ChatRepository } from "../repositories/ChatRepository";

export class CreateRoomUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly chatRepository: ChatRepository
  ) {}

  async execute(data: CreateRoomInDto): Promise<CreateRoomOutDto> {
    const user = await this.usersRepository.findById(data.userId);

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const room = Room.create(data.roomName);
    room.addOwner({ id: user.id, name: user.name, avatarUrl: user.avatarUrl });
    const firstRoomMessage = ChatMessage.create(
      user.id,
      `Esta sala foi criada por min: ${user.name}`
    );

    room.addMessage(firstRoomMessage);

    await this.chatRepository.saveRoom(room);

    return {
      ...room.info,
      lastMessageDatetime: "",
    };
  }
}
