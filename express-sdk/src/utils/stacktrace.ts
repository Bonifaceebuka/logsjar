import { SerializedError } from "../types/errors";

export function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: "cause" in error ? (error as any).cause : undefined,
    };
  }

  return {
    name: typeof error,
    message: String(error),
  };
}
