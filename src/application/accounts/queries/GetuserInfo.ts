import { AppError } from "@shared/errors/AppError";
import { GetUserInfoOutDto } from "../dtos/GetUserInfoDTO";
import { UsersRepository } from "../repositories/UsersRepository";

export class GetUserInfoQuery {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string): Promise<GetUserInfoOutDto> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }
}
