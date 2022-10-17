import { Request, Response } from "../../types";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { GetUserInfoQuery } from "@application/accounts/queries/GetuserInfo";
import { AppError } from "@shared/errors/AppError";

export class GetUserInfoController {
  constructor(httpServer: IHttpServer, private readonly getUserInfoQuery: GetUserInfoQuery) {
    httpServer.on("get", "/users/info", this.handle.bind(this));
  }

  private async handle(request: Request): Promise<Response> {
    const { userId } = request;

    if (!userId) {
      throw new AppError("userId is required");
    }

    const getUserInfoResult = await this.getUserInfoQuery.execute(userId);

    return {
      status: 200,
      body: getUserInfoResult,
    };
  }
}
