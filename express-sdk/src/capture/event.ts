import { Logsjar } from "../client";
import { LogsjarEvent } from "../types/events";

export function captureEvent(client: Logsjar, event: LogsjarEvent) {
  const enriched = {
    ...event,
    environment: event.environment ?? client.config.environment,
    release: event.release ?? client.config.release,
    service: event.service ?? client.config.service,
    context: client.scope.snapshot(),
  };

  client.batcher.enqueue(enriched);
}
