import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import { IAuthenticateInDTO, IAuthenticateOutDTO } from "@application/accounts/dtos/IAuthenticateDTO";
import { IUsersRepository } from "@application/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

export class AuthenticateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, password }: IAuthenticateInDTO): Promise<IAuthenticateOutDTO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email or password incorrect!");
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new AppError("Email or password incorrect!");
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: process.env.EXPIRES_AUTH_TOKEN || "1d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }
}
