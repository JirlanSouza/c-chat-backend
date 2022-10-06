export class NewMessageInDto {
  userId: string;
  text: string;
}

export interface NewMessageOutDto {
  id: string;
  userId: string;
  text: string;
  created: string;
}
