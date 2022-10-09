import { ChatMessage } from "./ChatMessage";
import { RoomUser } from "./RoomUser";

export class Room {
  private readonly id: string;
  private readonly title: string;
  private users: RoomUser[];
  private messages: ChatMessage[];

  private constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  static from(id: string, title: string, users: RoomUser[], messages: ChatMessage[]): Room {
    const room = new Room(id, title);
    room.addmanyUsers(users);
    room.addManyMessages(messages);
    return room;
  }

  addUser(user: RoomUser): void {
    this.users.push(user);
  }

  addmanyUsers(users: RoomUser[]): void {
    this.users = [...this.users, ...users];
  }

  addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }

  addManyMessages(messages: ChatMessage[]): void {
    this.messages = [...this.messages, ...messages];
  }
}
