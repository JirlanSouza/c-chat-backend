import { verify } from "jsonwebtoken";

import {
  VerifyAuthenticationInDto,
  VerifyAuthenticationOutDto,
} from "../dtos/VerifyAuthenticationDTO";
import { UsersRepository } from "../repositories/UsersRepository";

export class VerifyAuthenticationUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: VerifyAuthenticationInDto): Promise<VerifyAuthenticationOutDto> {
    try {
      const { sub: userId } = verify(data.token, process.env.JWT_SECRET);

      const user = await this.usersRepository.findById(userId as string);

      if (!user) {
        return { errorMessage: "This user does not exist!" };
      }

      return {
        userId: user.id,
      };
    } catch (err) {
      return { errorMessage: "Invalid token!" };
    }
  }
}
