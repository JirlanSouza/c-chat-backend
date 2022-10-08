export class NewMessageInDto {
  roomId: string;
  userId: string;
  text: string;
}

export interface NewMessageOutDto {
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
