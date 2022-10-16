import { AddUserToRoomUseCase } from "@application/chat/useCases/AddUserToRoom";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { AppError } from "@shared/errors/AppError";
import { Request, Response } from "../../types";

export class AddUserToRoomController {
  constructor(
    httpServer: IHttpServer,
    private readonly addUserInRoomUseCase: AddUserToRoomUseCase
  ) {
    httpServer.on("post", "/chat/rooms/users", this.handle.bind(this));
  }

  async handle(request: Request): Promise<Response> {
    const { roomId, userEmail } = request.body;

    if (!roomId || !userEmail) {
      throw new AppError("roomId and userEmail is required");
    }

    await this.addUserInRoomUseCase.execute({ roomId, userEmail });
    return { status: 204 };
  }
}
