import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { Mediator } from "@application/mediator/Mediator";
import { RoomUser } from "@domain/entities/RoomUser";
import { AppError } from "@shared/errors/AppError";
import { AddUserToRoomInDto } from "../dtos/AddUserToRoomDTO";
import { ChatRepository } from "../repositories/ChatRepository";

export class AddUserToRoomUseCase {
  private readonly EVENT_EMIT_NAME = "USER_ADDED_IN_ROOM";
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly chatRepository: ChatRepository,
    private readonly mediator: Mediator
  ) {}

  async execute(data: AddUserToRoomInDto): Promise<void> {
    const user = await this.usersRepository.findByEmail(data.userEmail);

    if (!user) {
      throw new AppError("User does not exist!");
    }

    const room = await this.chatRepository.findRoomById(data.roomId);

    if (!room) {
      throw new AppError("Room does not exists!");
    }

    const roomUser = new RoomUser(false, {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
    room.addUser(roomUser);
    const updatedRoom = await this.chatRepository.saveUserAtRoom(room.info.id, roomUser);

    if (!updatedRoom) {
      throw new AppError("Error on updated room user", 500);
    }

    await this.mediator.emit(this.EVENT_EMIT_NAME, { userId: user.id, room: updatedRoom });
  }
}
