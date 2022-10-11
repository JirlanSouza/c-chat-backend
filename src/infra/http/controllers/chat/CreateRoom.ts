import { CreateRoomUseCase } from "@application/chat/useCases/CreateRoom";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { Request, Response } from "../../types";

export class CreateRoomController {
  constructor(httpServer: IHttpServer, private readonly createRoomUseCase: CreateRoomUseCase) {
    httpServer.on("post", "/chat/rooms", this.handle.bind(this));
  }

  async handle(request: Request): Promise<Response> {
    const { userId } = request;
    const { roomName } = request.body;
    const createRoomResult = await this.createRoomUseCase.execute({ userId, roomName });
    return { status: 201, body: { ...createRoomResult } };
  }
}
