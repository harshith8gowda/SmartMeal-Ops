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

  if (error instanceof Error && error.message === "Unauthorized") {
    return { status: 401, body: { error: "UNAUTHORIZED", message: "Unauthorized" } };
  }

  console.error(error);
  return { status: 500, body: { error: "INTERNAL_ERROR", message: "Something went wrong" } };
}
