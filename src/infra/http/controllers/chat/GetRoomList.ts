import { GetRoomListQuery } from "@application/chat/queries/GetRoomList";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { AppError } from "@shared/errors/AppError";
import { Request, Response } from "../../types";

export class GetRoomLisController {
  constructor(httpServer: IHttpServer, private readonly getRoomLisQuery: GetRoomListQuery) {
    httpServer.on("get", "/chat/rooms/:userId", this.handler.bind(this));
  }

  async handler(request: Request): Promise<Response> {
    const { userId } = request.params;

    if (!userId) {
      throw new AppError("Authentication required!", 401);
    }

    const getRoomListResult = await this.getRoomLisQuery.execute({ userId });

    return { status: 200, body: getRoomListResult };
  }
}
