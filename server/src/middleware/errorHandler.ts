import type { NextFunction, Request, Response } from "express";
import { env } from "../env.js";

interface HttpError extends Error {
  status?: number;
}

export function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err.status || 500;

  if (env.NODE_ENV === "production") {
    res.status(statusCode).json({ error: "Internal Server Error" });
    return;
  }

  res.status(statusCode).json({ error: err.message || "Internal Server Error" });
}
