import { PrismaClient } from "@prisma/client";

import { IUsersRepository } from "@application/accounts/repositories/IUsersRepository";
import { User } from "@domain/entities/User";

export class PrismaUsersrepository implements IUsersRepository {
  private static prisma = new PrismaClient();

  async save(user: User): Promise<void> {
    await PrismaUsersrepository.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        avatarurl: user.avatarUrl,
      },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userModel = await PrismaUsersrepository.prisma.user.findUnique({ where: { email } });
    if (!userModel) {
      return undefined;
    }
    return User.from(userModel.id, userModel.name, userModel.email, userModel.password, userModel.avatarurl);
  }

  async findById(id: string): Promise<User | undefined> {
    const userModel = await PrismaUsersrepository.prisma.user.findUnique({ where: { id } });
    if (!userModel) {
      return undefined;
    }
    return User.from(userModel.id, userModel.name, userModel.email, userModel.password, userModel.avatarurl);
  }
}
