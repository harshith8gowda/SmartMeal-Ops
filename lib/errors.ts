import { z } from "zod";
import { Prisma } from "@prisma/client";

export type AppErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "OPENAI_ERROR"
  | "SWIGGY_ERROR"
  | "CONFLICT"
  | "FORBIDDEN"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly statusCode: number = 500,
    public readonly cause?: unknown
  ) {
    super(message);
  }
}

export function mapErrorToResponse(error: unknown): { status: number; body: { error: string; message: string } } {
  if (error instanceof AppError) {
    return { status: error.statusCode, body: { error: error.code, message: error.message } };
  }

  if (error instanceof z.ZodError) {
    return {
      status: 400,
      body: { error: "VALIDATION_ERROR", message: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") }
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return { status: 404, body: { error: "NOT_FOUND", message: "Record not found" } };
    }
    if (error.code === "P2002") {
      return { status: 409, body: { error: "CONFLICT", message: "Record already exists" } };
    }
    return { status: 500, body: { error: "INTERNAL_ERROR", message: "Database error" } };
  }

  if (error instanceof Error && error.message === "Unauthorized") {
    return { status: 401, body: { error: "UNAUTHORIZED", message: "Unauthorized" } };
  }

  if (error instanceof Error && error.message.toLowerCase().includes("not found")) {
    return { status: 404, body: { error: "NOT_FOUND", message: error.message } };
  }

  console.error(error);
  return { status: 500, body: { error: "INTERNAL_ERROR", message: "Something went wrong" } };
}
