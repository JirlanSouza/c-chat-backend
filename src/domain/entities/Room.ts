import { ChatMessage } from "./ChatMessage";
import { RoomUser } from "./RoomUser";

export class Room {
  private readonly id: string;
  private title: string;
  private users: RoomUser[];
  private messages: ChatMessage[];

  private constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
  }

  static from(id: string, title: string, users: RoomUser[], messages: ChatMessage[]) {
    const room = new Room(id, title);
    room.addmanyUsers(users);
    room.addManyMessages(messages);
    return room;
  }

  addUser(user: RoomUser) {
    this.users.push(user);
  }

  addmanyUsers(users: RoomUser[]) {
    this.users = [...this.users, ...users];
  }

  addMessage(message: ChatMessage) {
    this.messages.push(message);
  }

  addManyMessages(messages: ChatMessage[]) {
    this.messages = [...this.messages, ...messages];
  }
}
