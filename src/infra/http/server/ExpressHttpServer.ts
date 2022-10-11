import { Logger } from "@shared/logger";
import { Express, NextFunction, Request, Response } from "express";

import { Httphandler, HttpMethods, IHttpServer } from "./IHttpServer";

export class ExpressHttpServer implements IHttpServer {
  private currentMeddlewares: Array<
    (request: Request, response: Response, next: NextFunction) => Promise<void>
  > = [];

  constructor(private readonly app: Express) {}

  setMeddleware(meddleware): void {
    this.currentMeddlewares.push(meddleware);
  }

  on(method: HttpMethods, path: string, handler: Httphandler): void {
    Logger.info(`Register route ${method.toUpperCase()} in ${path}`);

    const handlerWrapper = async (request: Request, response: Response): Promise<Response> => {
      const tohandlerRequest = {
        ...request,
        query: request.query as Record<string, string>,
      };

      const handlerResponse = await handler(tohandlerRequest);
      return response.status(handlerResponse.status).json(handlerResponse.body);
    };

    if (this.currentMeddlewares) {
      this.app[method](path, ...this.currentMeddlewares, handlerWrapper);
      this.currentMeddlewares = [];
    }

    this.app[method](path, handlerWrapper);
  }

  async listener(port: number, onRuning?: () => void): Promise<void> {
    this.app.listen(port || 8080, onRuning);
  }
}
