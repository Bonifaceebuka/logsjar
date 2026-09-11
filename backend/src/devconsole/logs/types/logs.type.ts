import { LogType } from "../enums/logs.enums";

export const LOG_LEVELS = [
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];
// export type EventType = "exception" | "message" | "log" | "request" | "metric";
export interface User {
  id?: string;
  email?: string;
  username?: string;
  ipAddress?: string;
  [key: string]: unknown;
}

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

export interface IncomingLogEvent {
  type: LogType;
  level?: LogLevel;
  timestamp: number;
  message?: string;
  environment?: string;
  release?: string;
  service?: string;
  exception?: any;
  extra?: Record<string, unknown>;
  context?: ScopeContext;
  [key: string]: unknown;
}