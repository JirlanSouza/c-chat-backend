import { VerifyAuthenticationUseCase } from "@application/accounts/useCases/VerifyAuthentication";
import { AppError } from "@shared/errors/AppError";
import { Request, Response } from "../types";

export class HttpEnsureAuthenticated {
  constructor(private readonly verifyAuthentication: VerifyAuthenticationUseCase) {}

  async handler(request: Request, response: Response, next: () => void): Promise<void> {
    const authHeader = request.headers?.authorization;
    console.log(request.headers);

    if (!authHeader) {
      throw new AppError("Token missing!", 401);
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer") {
      throw new AppError("Invalid token!", 401);
    }

    try {
      const authorizationResult = await this.verifyAuthentication.execute({ token });

      if (!authorizationResult.userId) {
        throw new AppError(authorizationResult.errorMessage, 401);
      }

      request["userId"] = authorizationResult.userId;

      return next();
    } catch (err) {
      throw new AppError("Invalid token!", 401);
    }
  }
}
