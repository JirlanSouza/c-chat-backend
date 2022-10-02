export interface Request {
  query: Object;
  params: Object;
  body: Record<string, any>;
}

export interface Response {
  status: number;
  body?: Record<string, any>;
}
