import { Express } from "express";

import { Httphandler, HttpMethods, IHttpServer } from "./IHttpServer";

export class ExpressHttpServer implements IHttpServer {
  constructor(private readonly app: Express) {}

  on(method: HttpMethods, path: string, handler: Httphandler) {
    this.app[method](path, async (request, response) => {
      const handlerResponse = await handler(request);
      return response.status(handlerResponse.status).json(handlerResponse.body);
    });
  }

  async listener(port: number, onRuning?: () => void): Promise<void> {
    this.app.listen(port || 8080, onRuning);
  }
}
