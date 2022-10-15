import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { UsersInMemoryRepository } from "@infra/database/repositories/users/UsersInMemoryRepository";
import { AppError } from "@shared/errors/AppError";

let usersInMemoryRepository: UsersInMemoryRepository;
let registerUserUseCase: RegisterUserUseCase;

describe("RegisterUserUseCase", () => {
  beforeEach(() => {
    usersInMemoryRepository = new UsersInMemoryRepository();
    registerUserUseCase = new RegisterUserUseCase(usersInMemoryRepository);
  });

  it("Should be able register a new user", async () => {
    const userData = { name: "new user", email: "newuser@chat.com", password: "new_user_password" };
    await registerUserUseCase.execute(userData);
    const user = await usersInMemoryRepository.findByEmail(userData.email);

    expect(user).toHaveProperty("id");
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
  });

  it("Should not be able register user with existent email", async () => {
    const userData = { name: "new user", email: "newuser@chat.com", password: "new_user_password" };
    await registerUserUseCase.execute(userData);

    expect(async () => {
      await registerUserUseCase.execute(userData);
    }).rejects.toThrow(AppError);
  });
});
