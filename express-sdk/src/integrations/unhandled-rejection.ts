import { Logsjar } from "../client";

export function installUnhandledRejectionHandler(client: Logsjar) {
  process.on("unhandledRejection", async reason => {
    client.captureException(reason);
    await client.flush();
  });
}
