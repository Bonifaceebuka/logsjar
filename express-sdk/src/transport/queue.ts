import { LogsjarEvent } from "../types/events";

export class EventQueue {
  private readonly items: LogsjarEvent[] = [];

  push(event: LogsjarEvent) {
    this.items.push(event);
  }

  drain(max?: number) {
    return max ? this.items.splice(0, max) : this.items.splice(0);
  }

  get size() {
    return this.items.length;
  }
}
