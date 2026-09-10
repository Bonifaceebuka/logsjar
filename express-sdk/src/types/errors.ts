export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}
