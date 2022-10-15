import { ChatMessage } from "@domain/entities/ChatMessage";
import { Room } from "@domain/entities/Room";
import { MessageDto, RoomDto } from "../dtos/GetLastRoomMessagesDTO";
import { RoomDto as RoomWithLastMessageDatetimeDto } from "../dtos/GetRoomListDTO";

export interface ChatRepository {
  existsRoomById: (id: string) => Promise<boolean>;
  saveMessage: (roomId: string, message: ChatMessage) => Promise<void>;
  saveRoom: (room: Room) => Promise<void>;
  getRoomByName: (name: string) => Promise<RoomDto>;
  getMessages: (roomId: string, dateEnd: number, maxMessage: number) => Promise<MessageDto[]>;
  findRoomByUserId: (userId: string) => Promise<RoomWithLastMessageDatetimeDto[]>;
  findRoomIdByUserId: (userId: string) => Promise<string[]>;
}
