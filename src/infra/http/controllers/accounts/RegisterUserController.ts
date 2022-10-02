import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { Request, Response } from "../types";

export class RegisterUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    await this.registerUserUseCase.execute({
      name,
      email,
      password,
    });

    return {
      status: 201,
    };
  }
}
