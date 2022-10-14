import { sign } from "jsonwebtoken";

import { VerifyAuthenticationUseCase } from "@application/accounts/useCases/VerifyAuthentication";
import { User } from "@domain/entities/User";
import { UsersInMemoryRepository } from "@infra/database/repositories/users/UsersInMemoryRepository";

let usersInMemoryRepository: UsersInMemoryRepository;
let verifyAuthenticationUseCase: VerifyAuthenticationUseCase;

describe("VerifyAuthenticationUseCase", () => {
  beforeEach(() => {
    process.env = { ...process.env, JWT_SECRET: "secret" };

    usersInMemoryRepository = new UsersInMemoryRepository();
    verifyAuthenticationUseCase = new VerifyAuthenticationUseCase(usersInMemoryRepository);
  });

  it("Should be returned successful authentication", async () => {
    const user = await User.create("new user", "newuser@chat.com", "new_user_password", "");
    await usersInMemoryRepository.save(user);

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "15m",
    });

    const verifyAuthenticationResult = await verifyAuthenticationUseCase.execute({ token });

    expect(verifyAuthenticationResult.errorMessage).toBeUndefined();
    expect(verifyAuthenticationResult.userId).toBe(user.id);
  });

  it("Should be returned failled authentication if user does not exists", async () => {
    const user = await User.create("new user", "newuser@chat.com", "new_user_password", "");

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "15m",
    });

    const verifyAuthenticationResult = await verifyAuthenticationUseCase.execute({ token });

    expect(verifyAuthenticationResult.userId).toBeUndefined();
    expect(verifyAuthenticationResult.errorMessage).toBe("This user does not exist!");
  });

  it("Should be returned failled authentication if is invalid token", async () => {
    const user = await User.create("new user", "newuser@chat.com", "new_user_password", "");

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "15m",
    });

    const invalidToken = token + "-";

    const verifyAuthenticationResult = await verifyAuthenticationUseCase.execute({
      token: invalidToken,
    });

    expect(verifyAuthenticationResult.userId).toBeUndefined();
    expect(verifyAuthenticationResult.errorMessage).toBe("Invalid token!");
  });
});
