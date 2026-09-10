import { Logsjar } from "../client";

export class ExpressIntegration {
  static install(app: any, client: Logsjar) {
    app.use((req: any, _res: any, next: any) => {
      const started = process.hrtime.bigint();

      client.addBreadcrumb(`HTTP ${req.method} ${req.originalUrl ?? req.url}`);

      const originalEnd = _res.end;
      _res.end = function (...args: any[]) {
        try {
          const durationMs = Number(process.hrtime.bigint() - started) / 1e6;
          if (_res.statusCode >= 500) {
            client.captureMessage(`HTTP ${req.method} ${req.originalUrl ?? req.url} ${_res.statusCode}`, {
              level: "error",
              extra: {
                method: req.method,
                url: req.originalUrl ?? req.url,
                statusCode: _res.statusCode,
                durationMs,
              },
            });
          }
        } catch {}
        return originalEnd.apply(this, args);
      };

      next();
    });

    app.use((err: unknown, req: any, _res: any, next: any) => {
      client.captureException(err, {
        method: req.method,
        url: req.originalUrl ?? req.url,
      });
      next(err);
    });
  }
}
