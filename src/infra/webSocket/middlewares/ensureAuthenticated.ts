import { VerifyAuthenticationUseCase } from "@application/accounts/useCases/VerifyAuthentication";
import { AppEventError } from "@shared/errors/AppEventError";
import { Logger } from "@shared/logger";
import { Socket } from "socket.io";

export class WebSocketEnsureAuthenticated {
  constructor(private readonly verifyAuthentication: VerifyAuthenticationUseCase) {}

  async handler(socket: Socket, next: (args?) => void): Promise<void> {
    const { token } = socket.handshake.auth;
    if (!token) {
      Logger.info(`Websocket connection id:${socket.id} has missing token!`);
      next(new AppEventError("Token is missing!", socket.id));
      return;
    }

    const verifyAuthenticationResult = await this.verifyAuthentication.execute({ token });

    if (!verifyAuthenticationResult.userId) {
      next(new AppEventError(verifyAuthenticationResult.errorMessage, socket.id));
      return;
    }

    socket.handshake["userId"] = verifyAuthenticationResult.userId;
    next();
  }
}
