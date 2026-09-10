# @logsjar/express

Node.js SDK for Logsjar monitoring.

## Install

```bash
npm install @logsjar/express
```

## Basic usage

```ts
import { Logsjar } from "@logsjar/express";

const logsjar = new Logsjar({
  apiKey: process.env.LOGSJAR_API_KEY!,
  environment: "production",
  service: "api",
});

logsjar.captureException(new Error("Something failed"));

logsjar.captureMessage("Payment completed");

logsjar.setUser({ id: "123", email: "user@example.com" });
logsjar.setTag("module", "payments");
```

## Automatic process monitoring

```ts
const logsjar = new Logsjar({
  apiKey: process.env.LOGSJAR_API_KEY!,
  autoCapture: true,
});
```

## Express

```ts
const logsjar = new Logsjar({
  apiKey: process.env.LOGSJAR_API_KEY!,
});

logsjar.instrumentExpress(app);
```

The `/v1/events` endpoint is a placeholder until the exact Logsjar backend API contract is wired in.
