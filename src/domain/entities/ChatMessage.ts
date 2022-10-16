import { generateId } from "@shared/utils/id";

export class ChatMessage {
  readonly id: string;
  readonly userId: string;
  text: string;
  readonly created: Date;

  private constructor(id: string, userId: string, text: string, created = new Date()) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.created = created;
  }

  static from(id: string, userId: string, text: string, created: Date): ChatMessage {
    return new ChatMessage(id, userId, text, created);
  }

  static create(userId: string, text: string): ChatMessage {
    const id = generateId();
    return new ChatMessage(id, userId, text);
  }
}
