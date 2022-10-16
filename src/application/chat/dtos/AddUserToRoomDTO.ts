import { RoomDto } from "./GetRoomListDTO";

export interface AddUserToRoomInDto {
  roomId: string;
  userEmail: string;
}

export interface AddUserToRoomOutDto {
  userId: string;
  room: RoomDto;
}
