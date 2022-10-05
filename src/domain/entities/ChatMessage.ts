import { generateId } from "@shared/utils/id";

export class ChatMessage {
  readonly id: string;
  readonly userId: string;
  text: string;
  readonly created: Date;

  private constructor(id: string, userId: string, text: string) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.created = new Date();
  }

  static from(id: string, userId: string, text: string) {
    return new ChatMessage(id, userId, text);
  }

  static create(userId: string, text: string) {
    const id = generateId();
    return new ChatMessage(id, userId, text);
  }
}
