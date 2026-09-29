import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { createHarness } from "../harness/emitter";
import { handleRateUpdated } from "../services/rates-consumer/src/handler";
import { getAppliedEvents, getRate, listRates } from "../services/rates-consumer/src/store";

const VISIBLE_PAIRS = ["USD/NGN", "USD/ZAR"];

function json(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += String(chunk)));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

export function ratesApiPlugin(): Plugin {
  const harness = createHarness(handleRateUpdated);

  return {
    name: "rates-api",
    apply: "serve",
    configureServer(server) {
      if (process.env.VITEST) return;

      harness.start();
      server.httpServer?.on("close", () => harness.stop());

      server.middlewares.use(async (req, res, next) => {
        const url = (req.url ?? "").split("?")[0] ?? "";
        if (!url.startsWith("/api/")) return next();

        if (url === "/api/rates" && req.method === "GET") {
          const rates = listRates().filter((rate) => VISIBLE_PAIRS.includes(rate.pair));
          return json(res, 200, { rates, serverTime: new Date().toISOString() });
        }

        if (url === "/api/applied-events" && req.method === "GET") {
          return json(res, 200, { events: getAppliedEvents() });
        }

        if (url === "/api/harness/config" && req.method === "POST") {
          const patch = await readBody(req);
          return json(res, 200, { config: harness.configure(patch) });
        }

        if (url === "/api/trade" && req.method === "POST") {
          const body = await readBody(req);
          const pair = String(body.pair ?? "");
          const stored = getRate(pair);

          if (!stored) return json(res, 404, { error: "unknown-pair", pair });

          return json(res, 200, {
            ok: true,
            pair,
            rate: stored.rate,
            executedAt: new Date().toISOString(),
          });
        }

        return next();
      });
    },
  };
}
