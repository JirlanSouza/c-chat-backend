import { ChatMessage } from "@domain/entities/ChatMessage";
import { Room } from "@domain/entities/Room";
import { MessageDto, RoomDto } from "../dtos/GetLastRoomMessagesDTO";

export interface ChatRepository {
  existsRoomById(id: string): Promise<boolean>;
  saveMessage(roomId: string, message: ChatMessage): Promise<void>;
  getRoomByTitle(title: string): Promise<RoomDto>;
  getMessages(roomId: string, dateEnd: number, maxMessage: number): Promise<MessageDto[]>;
}
