import { createConfig, LogsjarConfig } from "./config/config";
import { Transport } from "./transport/transport";
import { Batcher } from "./transport/batcher";
import { Scope } from "./context/scope";
import { captureException } from "./capture/exception";
import { captureMessage } from "./capture/message";
import { captureEvent } from "./capture/event";
import { ExpressIntegration } from "./integrations/express";
import { installUncaughtHandlers } from "./integrations/uncaught";
import { installUnhandledRejectionHandler } from "./integrations/unhandled-rejection";
import { LogsjarEvent, EventLevel } from "./types/events";
import { User } from "./types/user";

export interface LogsjarOptions extends Partial<LogsjarConfig> {
  autoCapture?: boolean;
}

export class Logsjar {
  readonly config: LogsjarConfig;
  readonly transport: Transport;
  readonly batcher: Batcher;
  readonly scope: Scope;

  private installedProcessHandlers = false;

  constructor(options: LogsjarOptions) {
    this.config = createConfig(options);
    this.transport = new Transport(this.config);
    this.batcher = new Batcher(this.transport, this.config);
    this.scope = new Scope();

    if (options.autoCapture) this.enableAutoCapture();
  }

  captureException(error: unknown, extra?: Record<string, unknown>) {
    return captureException(this, error, extra);
  }

  captureMessage(
    message: string,
    options: { level?: EventLevel; extra?: Record<string, unknown> } = {},
  ) {
    return captureMessage(this, message, options);
  }

  captureEvent(event: LogsjarEvent) {
    return captureEvent(this, event);
  }

  setUser(user: User | null) {
    this.scope.setUser(user);
    return this;
  }

  setTag(key: string, value: string) {
    this.scope.setTag(key, value);
    return this;
  }

  setTags(tags: Record<string, string>) {
    this.scope.setTags(tags);
    return this;
  }

  addBreadcrumb(message: string, data?: Record<string, unknown>) {
    this.scope.addBreadcrumb({ message, data, timestamp: Date.now() });
    return this;
  }

  clearScope() {
    this.scope.clear();
    return this;
  }

  instrumentExpress(app: any) {
    ExpressIntegration.install(app, this);
    return this;
  }

  enableAutoCapture() {
    if (this.installedProcessHandlers) return this;

    installUncaughtHandlers(this);
    installUnhandledRejectionHandler(this);
    this.installedProcessHandlers = true;
    return this;
  }

  flush() {
    return this.batcher.flush();
  }

  async shutdown() {
    await this.batcher.flush();
    this.batcher.stop();
  }
}
