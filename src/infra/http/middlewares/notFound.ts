import { Response } from "express";

export function notFound(_, response: Response): Response {
  return response.status(404).json({ message: "This endpoint does not exist in api!" });
}
