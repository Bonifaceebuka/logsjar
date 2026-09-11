import { LogsjarConfig } from "../config/config";
import { retry } from "./retry";

export interface TransportResponse {
  status: number;
  body?: unknown;
}

export class Transport {
  constructor(private readonly config: LogsjarConfig) {}

  async send(events: unknown[]): Promise<TransportResponse> {
    if (!this.config.enabled || events.length === 0) {
      return { status: 204 };
    }

    return retry(
      async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
        try {
          const response = await fetch(`${this.config.baseUrl.replace(/\/$/, "")}/logs`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${this.config.apiKey}`,
              "user-agent": "@logsjar/expressjs",
            },
            body: JSON.stringify({ events }),
            signal: controller.signal,
          });

          const text = await response.text();
          let body: unknown;
          try { body = text ? JSON.parse(text) : undefined; } catch { body = text; }

          if (!response.ok) {
            throw new Error(`Logsjar API returned ${response.status}`);
          }

          return { status: response.status, body };
        } finally {
          clearTimeout(timer);
        }
      },
      this.config.maxRetries,
      this.config.retryBaseDelayMs,
    );
  }
}
