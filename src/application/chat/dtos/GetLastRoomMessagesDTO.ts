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
  files?: MessageFile[];
  created: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface MessageFile {
  id: string;
  name: string;
  type: string;
  size: number;
  available: boolean;
}

export interface RoomDto {
  id: string;
  name: string;
}
