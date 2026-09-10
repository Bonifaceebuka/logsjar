import { Logsjar } from "../client";

export function installUncaughtHandlers(client: Logsjar) {
  process.on("uncaughtException", async error => {
    client.captureException(error);
    await client.flush();
    process.exitCode = 1;
  });
}
