import { toHash } from "@shared/utils/hash";
import { generateId } from "@shared/utils/id";

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;

  static async create(
    name: string,
    email: string,
    password: string,
    avatarUrl: string
  ): Promise<User> {
    const id = generateId();
    const passwordHash = await toHash(password);
    return new User(id, name, email, passwordHash, avatarUrl);
  }

  static from(id: string, name: string, email: string, password: string, avatarUrl: string): User {
    return new User(id, name, email, password, avatarUrl);
  }

  private constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    avatarUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatarUrl = avatarUrl;

    return this;
  }
}
