import { randomUUID } from "node:crypto";

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;

  static create(name: string, email: string, password: string) {
    const id = randomUUID();
    return new User(id, name, email, password, "");
  }

  static from(id: string, name: string, email: string, password: string, avatarUrl: string) {
    return new User(id, name, email, password, avatarUrl);
  }

  private constructor(id: string, name: string, email: string, password: string, avatarUrl: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatarUrl = avatarUrl;

    return this;
  }
}
