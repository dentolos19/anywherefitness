import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "@/lib/database/schema";

export function getDatabase() {
  const { env } = getCloudflareContext();
  return drizzle(env.DATABASE, { schema });
}

export function getBucket() {
  return getCloudflareContext().env.BUCKET;
}
