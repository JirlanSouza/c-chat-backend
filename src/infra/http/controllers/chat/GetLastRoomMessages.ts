import { GetLastRoomMessagesQuery } from "@application/chat/queries/GetLastRoomMessages";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { Request, Response } from "../../types";

export class GetLastRoomMessagesController {
  constructor(
    httpServer: IHttpServer,
    private readonly getLastRoomMessageQuery: GetLastRoomMessagesQuery
  ) {
    httpServer.on("get", "/chat", this.handler.bind(this));
  }

  async handler(request: Request): Promise<Response> {
    const { "room-id": roomId, "max-messages": maxMessages } = request.query;

    const getLastRoomMessageResult = await this.getLastRoomMessageQuery.execute({
      roomId,
      maxMessages: parseInt(maxMessages),
    });

    return { status: 200, body: { ...getLastRoomMessageResult } };
  }
}
