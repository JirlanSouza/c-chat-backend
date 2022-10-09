export interface Request {
  query: Record<string, string>;
  params: Record<string, string>;
  body: Record<string, unknown>;
}

export interface Response {
  status: number;
  body?: Record<string, unknown>;
}
