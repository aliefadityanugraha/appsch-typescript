import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  console.error(`[ERROR] ${err.message}`, err);

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export default errorHandler;
