import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { User } from "@domain/entities/User";

export class UsersInMemoryRepository implements UsersRepository {
  private readonly users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    return user;
  }
}
