import { config } from "dotenv";
import { IRegisterUserDTO } from "@application/accounts/dtos/IRegisterUserDTO";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";
import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { UsersInMemoryRepository } from "@infra/database/repositories/users/UsersInMemoryRepository";
import { AppError } from "@shared/errors/AppError";

config();

let usersInMemoryRepository: UsersInMemoryRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let registerUserUseCase: RegisterUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersInMemoryRepository);
    registerUserUseCase = new RegisterUserUseCase(usersInMemoryRepository);
  });

  it("Should be able to authenticate an user", async () => {
    const userData: IRegisterUserDTO = {
      name: "New user",
      email: "newuser@cchat.com",
      password: "newUser",
    };

    await registerUserUseCase.execute(userData);
    process.env.SECRET = "secret";

    const authenticationData = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(authenticationData).toHaveProperty("token");
    expect(authenticationData.user.email).toBe("newuser@cchat.com");
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "newUsser@cchat.com",
        password: "newUser",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      const userData: IRegisterUserDTO = {
        name: "New user",
        email: "newuser@cchat.com",
        password: "newUser",
      };

      await registerUserUseCase.execute(userData);
      process.env.SECRET = "secret";

      await authenticateUserUseCase.execute({
        email: userData.email,
        password: "incorrect password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
