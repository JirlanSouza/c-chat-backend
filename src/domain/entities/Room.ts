import { ChatMessage } from "./ChatMessage";
import { RoomUser } from "./RoomUser";

export class Room {
  private readonly id: string;
  private readonly name: string;
  private readonly avatarUrl: string;
  private users: RoomUser[];
  private messages: ChatMessage[];

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.avatarUrl = "";
  }

  static from(id: string, name: string, users: RoomUser[], messages: ChatMessage[]): Room {
    const room = new Room(id, name);
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
