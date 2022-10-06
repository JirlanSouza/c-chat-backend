export class NewMessageInDto {
  roomId: string;
  userId: string;
  text: string;
}

export interface NewMessageOutDto {
  id: string;
  roomId: string;
  userId: string;
  text: string;
  created: string;
}
