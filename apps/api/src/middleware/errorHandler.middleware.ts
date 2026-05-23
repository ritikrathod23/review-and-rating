import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { ApiResponse } from "@repo/types";

export class AppError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = error.message || "An unexpected error occurred on the server.";
  let errors: Record<string, string[]> | undefined;

  // Log error for developers
  console.error("API Error Trace:", error);

  // 1. Zod Validation Errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Input validation failed";
    errors = {};
    for (const issue of error.issues) {
      const field = issue.path.join(".");
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }
  }
  // 2. Custom Operational App Errors
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  }
  // 3. Mongoose Validation Errors
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Database schema validation failed";
    errors = {};
    for (const key in error.errors) {
      errors[key] = [error.errors[key].message];
    }
  }
  // 4. Mongoose Cast Error (Invalid IDs)
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid format for field ${error.path}: '${error.value}'`;
  }
  // 5. Duplicate Key Database Errors (e.g. unique field constraint)
  else if ((error as any).code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys((error as any).keyValue || {})[0];
    message = duplicatedField
      ? `A company with this ${duplicatedField} already exists.`
      : "Duplicate resource constraint violation.";
  }

  const responseBody: ApiResponse<null> = {
    success: false,
    error: message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(responseBody);
};
