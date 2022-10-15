import { Request, Response } from "../types";

export type HttpMethods = "get" | "post" | "put" | "delete" | "patch";
export type Httphandler = (request: Request) => Promise<Response>;
export type HttpMeddleware = (
  request: Request,
  response: Response,
  next: () => void
) => Promise<void>;

export interface IHttpServer {
  setMeddleware: (meddleware) => void;
  on: (method: HttpMethods, path: string, ...handlers: Array<Httphandler | HttpMeddleware>) => void;
  listener: (port: number, onRuning?: () => void) => Promise<void>;
}
