import { Logsjar } from "../client";
import { EventLevel } from "../types/events";

export function captureMessage(
  client: Logsjar,
  message: string,
  options: { level?: EventLevel; extra?: Record<string, unknown> } = {},
) {
  return client.captureEvent({
    type: "message",
    level: options.level ?? "info",
    timestamp: Date.now(),
    message,
    extra: options.extra,
  });
}
