import { NextFunction, Request, Response } from "express";

import { AppError } from "@shared/errors/AppError";
import { Logger } from "@shared/logger";

export const errorVerification = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
): Response => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  Logger.error(err);
  return response.status(500).json({ status: "error", message: `Internal server error!` });
};
