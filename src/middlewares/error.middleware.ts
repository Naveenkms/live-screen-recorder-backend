import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error";

const errorMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid or missing token" });
  }

  const status = err instanceof ApiError ? err.status : 500;
  console.log("process.env.NODE_ENV", process.env.NODE_ENV);
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
