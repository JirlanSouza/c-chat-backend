export interface GetRoomListInDto {
  userId: string;
}

export interface GetRoomListOutDto {
  rooms: RoomDto[];
}

export interface RoomDto {
  id: string;
  name: string;
  lastMessageDatetime: string;
}
