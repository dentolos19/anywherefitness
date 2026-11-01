import { bindings, defineConfig, defineWorker } from "cf/config";

const workerName = "anywherefitness";

export default defineConfig({
  worker: defineWorker({
    name: workerName,
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-01",
    observability: {
      logs: { enabled: true },
      traces: { enabled: true },
      issues: { enabled: true },
    },
    domains: ["anywherefitness.dennise.me"],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: bindings.secret(),
      DATABASE: bindings.d1({ name: workerName, id: "71228599-7b5f-459b-a912-c23207896d65" }),
      BUCKET: bindings.r2({ name: workerName }),
    },
  }),
});
