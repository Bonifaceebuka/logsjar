import { Logsjar } from "../client";
import { serializeError } from "../utils/stacktrace";
import { LogsjarEvent } from "../types/events";

export function captureException(
  client: Logsjar,
  error: unknown,
  extra?: Record<string, unknown>,
) {
  const event: LogsjarEvent = {
    type: "exception",
    level: "error",
    timestamp: Date.now(),
    message: error instanceof Error ? error.message : String(error),
    exception: serializeError(error),
    extra,
  };

  return client.captureEvent(event);
}
