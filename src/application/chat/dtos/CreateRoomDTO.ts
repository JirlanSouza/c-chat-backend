export interface CreateRoomInDto {
  userId: string;
  roomName: string;
}

export interface CreateRoomOutDto {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessageDatetime: string;
}
