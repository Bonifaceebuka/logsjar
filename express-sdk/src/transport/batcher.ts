import { LogsjarConfig } from "../config/config";
import { Transport } from "./transport";
import { LogsjarEvent } from "../types/events";

export class Batcher {
  private queue: LogsjarEvent[] = [];
  private timer: NodeJS.Timeout;

  constructor(
    private readonly transport: Transport,
    private readonly config: LogsjarConfig,
  ) {
    this.timer = setInterval(() => void this.flush(), config.flushIntervalMs);
    this.timer.unref?.();
  }

  enqueue(event: LogsjarEvent) {
    if (!this.config.enabled) return;

    if (this.queue.length >= this.config.maxQueueSize) {
      this.queue.shift();
    }

    this.queue.push(event);

    if (this.queue.length >= this.config.batchSize) {
      void this.flush();
    }
  }

  async flush() {
    if (!this.queue.length) return;

    const events = this.queue.splice(0, this.config.batchSize);
    try {
      await this.transport.send(events);
    } catch {
      // Do not crash the host application because monitoring failed.
      // Failed events are intentionally dropped after transport retries.
    }

    if (this.queue.length) await this.flush();
  }

  stop() {
    clearInterval(this.timer);
  }
}
