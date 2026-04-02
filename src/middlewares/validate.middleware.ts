import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ApiError from "../utils/apiError";

const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.safeParse(req.body);

    if (error) {
      const formattedErrors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new ApiError(400, "Validation error", formattedErrors);
    }

    next();
  };
};

export default validate;
