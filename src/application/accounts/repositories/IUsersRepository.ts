import { User } from "@domain/accounts/User";

export interface IUsersRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
}
