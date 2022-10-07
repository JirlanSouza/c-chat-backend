export interface Request {
  query: Record<string, string>;
  params: Record<string, string>;
  body: Record<string, any>;
}

export interface Response {
  status: number;
  body?: Record<string, any>;
}
