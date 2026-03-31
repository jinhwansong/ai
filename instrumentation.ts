import * as Sentry from "@sentry/nextjs";
import { validateProductionEnv } from "@/lib/env/server";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    validateProductionEnv();
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
