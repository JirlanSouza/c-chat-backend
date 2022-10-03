import { Request, Response } from "../controllers/types";

export type HttpMethods = "get" | "post" | "put" | "delete" | "patch";
export type Httphandler = (request: Request) => Promise<Response>;

export interface IHttpServer {
  on(method: HttpMethods, path: string, handler: Httphandler);
  listener(port: number, onRuning?: () => void): Promise<void>;
}
