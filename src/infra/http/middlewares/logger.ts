import { NextFunction, Request, Response } from "express";

import { Logger } from "@shared/logger/index";

export function logger(request: Request, response: Response, next: NextFunction): void {
  Logger.info(`${request.method} => ${request.originalUrl}`);
  return next();
}
