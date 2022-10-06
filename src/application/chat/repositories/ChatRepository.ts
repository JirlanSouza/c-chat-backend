import { ChatMessage } from "@domain/entities/ChatMessage";

export interface ChatRepository {
  existsRoomById(id: string): Promise<boolean>;
  saveMessage(roomId: string, message: ChatMessage): Promise<void>;
}
