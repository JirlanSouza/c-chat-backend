import { GenerateFileDownloadUrlUseCase } from "@application/chat/useCases/generateFileDownloadUrl";
import { IHttpServer } from "@infra/http/server/IHttpServer";
import { Request, Response } from "@infra/http/types";
import { AppError } from "@shared/errors/AppError";

export class GenerateFileDownloadUrlController {
  constructor(
    httpServer: IHttpServer,
    private readonly generateFileDownloadUrlUseCase: GenerateFileDownloadUrlUseCase
  ) {
    httpServer.on("post", "/chat/files", this.handle.bind(this));
  }

  async handle(request: Request): Promise<Response> {
    const { userId } = request;
    const { fileId } = request.body;

    if (!userId) {
      throw new AppError("Authentication required!", 401);
    }

    if (!fileId) {
      throw new AppError("fileId is required!");
    }

    const generateFileDownloadUrlResult = await this.generateFileDownloadUrlUseCase.execute({
      userId,
      fileId,
    });
    return { status: 201, body: { ...generateFileDownloadUrlResult } };
  }
}
