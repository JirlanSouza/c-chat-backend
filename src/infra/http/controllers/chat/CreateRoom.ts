import { CreateRoomUseCase } from "@application/chat/useCases/CreateRoom";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { AppError } from "@shared/errors/AppError";
import { Request, Response } from "../../types";

export class CreateRoomController {
  constructor(httpServer: IHttpServer, private readonly createRoomUseCase: CreateRoomUseCase) {
    httpServer.on("post", "/chat/rooms", this.handle.bind(this));
  }

  async handle(request: Request): Promise<Response> {
    const { userId } = request;
    const { roomName } = request.body;

    if (!roomName) {
      throw new AppError("roomName is required");
    }

    const createRoomResult = await this.createRoomUseCase.execute({ userId, roomName });
    return { status: 201, body: { ...createRoomResult } };
  }
}
