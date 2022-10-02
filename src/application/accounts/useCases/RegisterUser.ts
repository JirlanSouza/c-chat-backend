import { hash } from "bcrypt";

import { AppError } from "@shared/errors/AppError";
import { IRegisterUserDTO } from "@application/accounts/dtos/IRegisterUserDTO";
import { IUsersRepository } from "@application/accounts/repositories/IUsersRepository";
import { User } from "@domain/entities/User";

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRegisterUserDTO): Promise<void> {
    const existUser = await this.usersRepository.findByEmail(email);

    if (existUser) {
      throw new AppError("user already exists!");
    }

    const passwordHash = await hash(password, 8);
    const user = User.create(name, email, passwordHash);

    if (!User) {
      throw new AppError("Invalid user arguments");
    }

    await this.usersRepository.save(user);
  }
}
