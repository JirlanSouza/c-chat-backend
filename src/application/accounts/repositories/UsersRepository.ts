import { User } from "@domain/entities/User";

export interface UsersRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
