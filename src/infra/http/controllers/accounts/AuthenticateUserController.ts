import { Request, Response } from "../types";
import { AuthenticateUserUseCase } from "@application/accounts/useCases/AuthenticateUser";
import { IHttpServer } from "@infra/http/server/IHttpServer";

export class AuthenticateUserController {
  constructor(httpServer: IHttpServer, private readonly authenticateUserUseCase: AuthenticateUserUseCase) {
    httpServer.on("post", "/auth", this.handle.bind(this));
  }

  private async handle(request: Request): Promise<Response> {
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
