import { AppError } from "@/lib/errors";

export function mapSwiggyError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof Error) {
    if (error.message.includes("401") || error.message.includes("session expired")) {
      return new AppError("SWIGGY_ERROR", "Swiggy MCP session expired. Please reconnect.", 401, error);
    }
    return new AppError("SWIGGY_ERROR", error.message, 500, error);
  }

  return new AppError("SWIGGY_ERROR", "Swiggy MCP request failed", 500, error);
}
