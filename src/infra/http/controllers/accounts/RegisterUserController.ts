import { RegisterUserUseCase } from "@application/accounts/useCases/RegisterUser";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { Request, Response } from "../types";

export class RegisterUserController {
  constructor(httpServer: IHttpServer, private readonly registerUserUseCase: RegisterUserUseCase) {
    httpServer.on("post", "/users", this.handle.bind(this));
  }

  private async handle(request: Request): Promise<Response> {
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
