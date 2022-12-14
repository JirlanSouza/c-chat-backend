export class NewMessageInDto {
  roomId: string;
  userId: string;
  text: string;
  files?: MessageFileData[];
}

export interface MessageFileData {
  name: string;
  type: string;
  size: number;
}

export interface NewMessageOutDto {
  id: string;
  roomId: string;
  user: User;
  text: string;
  files?: MessageFileOutData[];
  created: string;
}

export interface MessageFileOutData {
  id: string;
  name: string;
  type: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}
