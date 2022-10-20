export class NewMessageInDto {
  roomId: string;
  userId: string;
  text: string;
  files?: MessageFileData[];
}

export interface MessageFileData {
  fileName: string;
  fileType: string;
  fileSize: number;
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
  url: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}
