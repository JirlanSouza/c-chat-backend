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
  userId: string;
  text: string;
  created: string;
}

export interface RoomDto {
  id: string;
  title: string;
}
