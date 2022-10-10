import {
  GetLastRoomMessagesInDto,
  GetLastRoomMessagesOutDto,
} from "../dtos/GetLastRoomMessagesDTO";
import { ChatRepository } from "../repositories/ChatRepository";

export class GetLastRoomMessagesQuery {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(queryData: GetLastRoomMessagesInDto): Promise<GetLastRoomMessagesOutDto> {
    let roomId = queryData.roomId;
    if (!queryData.roomId) {
      const defaultRoom = await this.chatRepository.getRoomByName("Geral");
      roomId = defaultRoom.id;
    }

    const dateEnd = Date.now();

    const messages = await this.chatRepository.getMessages(
      roomId,
      dateEnd,
      queryData.maxMessages || 50
    );

    return { messages };
  }
}
