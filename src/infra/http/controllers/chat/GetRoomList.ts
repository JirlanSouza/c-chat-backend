import { GetRoomListQuery } from "@application/chat/queries/GetRoomList";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { Request, Response } from "../../types";

export class GetRoomLisController {
  constructor(httpServer: IHttpServer, private readonly getRoomLisQuery: GetRoomListQuery) {
    httpServer.on("get", "/chat/rooms/:userId", this.handler.bind(this));
  }

  async handler(request: Request): Promise<Response> {
    const { userId } = request.params;

    const getRoomListResult = await this.getRoomLisQuery.execute({ userId });

    return { status: 200, body: getRoomListResult };
  }
}
