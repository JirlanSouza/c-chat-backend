import { generateId } from "@shared/utils/id";
import { ChatMessage } from "./ChatMessage";
import { RoomUser, UserInfo } from "./RoomUser";

interface RoomInfo {
  id: string;
  name: string;
  avatarUrl: string;
}

export class Room {
  private readonly id: string;
  private readonly name: string;
  private readonly avatarUrl: string;
  private users: RoomUser[] = [];
  private messages: ChatMessage[] = [];

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.avatarUrl = "";
  }

  static create(name: string): Room {
    const id = generateId();
    return new Room(id, name);
  }

  static from(id: string, name: string, users: RoomUser[], messages: ChatMessage[]): Room {
    const room = new Room(id, name);
    room.addmanyUsers(users);
    room.addManyMessages(messages);
    return room;
  }

  addOwner(userInfo: UserInfo): void {
    const user = new RoomUser(false, userInfo);
    user.setOwner();
    this.addUser(user);
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

  get info(): RoomInfo {
    return {
      id: this.id,
      name: this.name,
      avatarUrl: this.avatarUrl,
    };
  }

  get usersList(): RoomUser[] {
    return [...this.users];
  }

  get messagesList(): ChatMessage[] {
    return [...this.messages];
  }
}
