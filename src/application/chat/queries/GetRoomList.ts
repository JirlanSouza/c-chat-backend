import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { GetRoomListInDto, GetRoomListOutDto } from "../dtos/GetRoomListDTO";
import { ChatRepository } from "../repositories/ChatRepository";

export class GetRoomListQuery {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(queryData: GetRoomListInDto): Promise<GetRoomListOutDto> {
    const rooms = await this.chatRepository.findRoomByUserId(queryData.userId);
    return { rooms };
  }
}
