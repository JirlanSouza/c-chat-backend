import { Request, Response } from "../types";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";

export class AuthenticateUserController {
  constructor(private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticationData = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    return {
      status: 200,
      body: authenticationData,
    };
  }
}
