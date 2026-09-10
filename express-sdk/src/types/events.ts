import { User } from "./user";

export type EventType = "exception" | "message" | "log" | "request" | "metric";
export type EventLevel = "debug" | "info" | "warning" | "error" | "fatal";

export interface Breadcrumb {
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export interface ScopeContext {
  user?: User;
  tags?: Record<string, string>;
  breadcrumbs?: Breadcrumb[];
}

export interface LogsjarEvent {
  type: EventType;
  level?: EventLevel;
  timestamp: number;
  message?: string;
  environment?: string;
  release?: string;
  service?: string;
  exception?: unknown;
  extra?: Record<string, unknown>;
  context?: ScopeContext;
  [key: string]: unknown;
}
