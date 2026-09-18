import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "@/lib/database/schema";

export function getDatabase() {
  return drizzle(env.DATABASE, { schema });
}

export function getBucket() {
  return env.BUCKET;
}
