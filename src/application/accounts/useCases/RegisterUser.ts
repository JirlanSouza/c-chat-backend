import { AppError } from "@shared/errors/AppError";
import { IRegisterUserDTO } from "@application/accounts/dtos/IRegisterUserDTO";
import { UsersRepository } from "@application/accounts/repositories/UsersRepository";
import { User } from "@domain/entities/User";

export class RegisterUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ name, email, password }: IRegisterUserDTO): Promise<void> {
    const existUser = await this.usersRepository.findByEmail(email);

    if (existUser) {
      throw new AppError("user already exists!");
    }

    const user = await User.create(name, email, password, "");

    if (!User) {
      throw new AppError("Invalid user arguments");
    }

    await this.usersRepository.save(user);
  }
}
