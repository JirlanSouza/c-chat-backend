export interface GetLastRoomMessagesInDto {
  roomId?: string;
  maxMessages: number;
}

export interface GetLastRoomMessagesOutDto {
  messages: MessageDto[];
}

export interface MessageDto {
  id: string;
  roomId: string;
  user: User;
  text: string;
  created: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface RoomDto {
  id: string;
  title: string;
}
