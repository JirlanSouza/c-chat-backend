export interface GetRoomListInDto {
  userId: string;
}

export interface GetRoomListOutDto {
  rooms: RoomDto[];
}

export interface RoomDto {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessageDatetime: string;
}
