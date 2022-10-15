/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Request {
  query: Record<string, string>;
  params: Record<string, string>;
  body: Record<string, any>;
  headers: {
    authorization?: string;
  };
  userId?: string;
}

export interface Response {
  status: number;
  body?: Record<string, any>;
}

export type HttpMeddleware = (request: Request, response: Response, next: any) => Promise<void>;
