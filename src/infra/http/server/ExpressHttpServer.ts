import { Logger } from "@shared/logger";
import { Express, Response } from "express";

import { Httphandler, HttpMethods, IHttpServer } from "./IHttpServer";

export class ExpressHttpServer implements IHttpServer {
  constructor(private readonly app: Express) {}

  on(method: HttpMethods, path: string, handler: Httphandler): void {
    Logger.info(`Register route ${method.toUpperCase()} in ${path}`);
    this.app[method](path, async (request, response): Promise<Response> => {
      const tohandlerRequest = {
        ...request,
        query: request.query as Record<string, string>,
      };

      const handlerResponse = await handler(tohandlerRequest);
      return response.status(handlerResponse.status).json(handlerResponse.body);
    });
  }

  async listener(port: number, onRuning?: () => void): Promise<void> {
    this.app.listen(port || 8080, onRuning);
  }
}
