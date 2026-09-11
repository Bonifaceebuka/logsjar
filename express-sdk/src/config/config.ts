export interface LogsjarConfig {
  apiKey: string;
  baseUrl: string;
  environment: string;
  release?: string;
  service?: string;
  batchSize: number;
  flushIntervalMs: number;
  maxQueueSize: number;
  maxRetries: number;
  retryBaseDelayMs: number;
  timeoutMs: number;
  enabled: boolean;
  debug: boolean;
}

export function createConfig(options: Partial<LogsjarConfig> & { apiKey?: string }): LogsjarConfig {
  const apiKey = options.apiKey ?? process.env.LOGSJAR_API_KEY;
  if (!apiKey) throw new Error("Logsjar: apiKey is required.");

  return {
    apiKey,
    baseUrl: options.baseUrl ?? "http://localhost:2026",
    environment: options.environment ?? process.env.NODE_ENV ?? "development",
    release: options.release,
    service: options.service,
    batchSize: options.batchSize ?? 20,
    flushIntervalMs: options.flushIntervalMs ?? 2000,
    maxQueueSize: options.maxQueueSize ?? 1000,
    maxRetries: options.maxRetries ?? 3,
    retryBaseDelayMs: options.retryBaseDelayMs ?? 500,
    timeoutMs: options.timeoutMs ?? 10000,
    enabled: options.enabled ?? true,
    debug: options.debug ?? false,
  };
}
