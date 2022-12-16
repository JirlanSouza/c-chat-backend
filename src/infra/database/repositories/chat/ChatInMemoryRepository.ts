import {
  MessageDto,
  RoomDto,
} from '@application/chat/dtos/GetLastRoomMessagesDTO';
import { RoomDto as RoomWithLastMessageDatetimeDto } from '@application/chat/dtos/GetRoomListDTO';
import { ChatRepository } from '@application/chat/repositories/ChatRepository';
import { ChatMessage } from '@domain/entities/ChatMessage';
import { Room } from '@domain/entities/Room';
import { RoomUser } from '@domain/entities/RoomUser';
import { AppError } from '@shared/errors/AppError';

export class ChatInMemoryRepository implements ChatRepository {
  private readonly rooms: Room[] = [];
  private readonly messages: Array<{ roomId: string; message: ChatMessage }> =
    [];

  async existsRoomById(id: string): Promise<boolean> {
    return this.rooms.some((room) => room.info.id === id);
  }

  async saveMessage(roomId: string, message: ChatMessage): Promise<void> {
    this.messages.push({ roomId, message });
  }

  async saveRoom(room: Room): Promise<void> {
    this.rooms.push(room);
  }

  async saveUserAtRoom(
    roomId: string,
    roomUser: RoomUser,
  ): Promise<RoomWithLastMessageDatetimeDto> {
    return null;
  }

  async getRoomByName(name: string): Promise<RoomDto> {
    const room = this.rooms.find((room) => room.info.name === name);

    if (!room) {
      throw new AppError('Room not found!');
    }

    return {
      id: room.info.id,
      name: room.info.name,
    };
  }

  async getMessages(
    roomId: string,
    dateEnd: number,
    maxMessage: number,
  ): Promise<MessageDto[]> {
    const messages = this.messages.filter(
      (message) => message.roomId === roomId,
    );

    return messages.map((message) => {
      return {
        ...message.message,
        roomId,
        user: {} as any,
        created: message.message.created.toLocaleString('pt-br'),
      };
    });
  }

  async findRoomByUserId(
    userId: string,
  ): Promise<RoomWithLastMessageDatetimeDto[]> {
    const rooms = this.rooms.filter((room) =>
      room.usersList.some((user) => user.userInfo.id === userId),
    );

    return rooms.map((room) => {
      return {
        id: room.info.id,
        name: room.info.name,
        avatarUrl: room.info.avatarUrl,
        lastMessageDatetime: '',
      };
    });
  }

  async findRoomIdByUserId(userId: string): Promise<string[]> {
    const rooms = this.rooms.filter((room) =>
      room.usersList.some((user) => user.userInfo.id === userId),
    );

    return rooms.map((room) => room.info.id);
  }

  async findRoomById(roomId: string): Promise<Room> {
    const room = this.rooms.find((room) => room.info.id === roomId);
    return room;
  }
}
