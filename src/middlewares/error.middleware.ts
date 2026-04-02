import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

const errorMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err instanceof ApiError ? err.status : 500;

  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err instanceof ApiError ? err.errors : null,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
