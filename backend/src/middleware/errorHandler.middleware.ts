import { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"],
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: "InternalServerError",
    message: "Something went wrong",
    statusCode: 500,
    timestamp: new Date().toISOString(),
    requestId: req.headers["x-request-id"],
  });
};