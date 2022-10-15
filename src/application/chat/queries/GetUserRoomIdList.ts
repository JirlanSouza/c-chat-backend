import { ChatRepository } from "../repositories/ChatRepository";

export class GetUserRoomIdListQuery {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(userId: string): Promise<string[]> {
    const roomIds = await this.chatRepository.findRoomIdByUserId(userId);
    return roomIds;
  }
}
