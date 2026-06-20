import { eq } from "drizzle-orm";

import { asset } from "@/lib/database/schema";
import { getBucket, getDatabase } from "@/lib/database/server";

export const MAX_ASSET_SIZE = 50 * 1024 * 1024;

async function hashFile(file: File) {
  const buffer = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAsset(file: File) {
  if (file.size > MAX_ASSET_SIZE) throw new Error("The file exceeds the 50 MB asset limit.");

  const id = crypto.randomUUID();
  await getBucket().put(id, file);

  try {
    const [record] = await getDatabase()
      .insert(asset)
      .values({ hash: await hashFile(file), id, name: file.name, size: file.size, type: file.type })
      .returning();
    return record;
  } catch (error) {
    await getBucket()
      .delete(id)
      .catch((deleteError: unknown) => console.error("Unable to delete the orphaned asset.", deleteError));
    throw error;
  }
}

export async function deleteAsset(id: string) {
  await getBucket().delete(id);
  await getDatabase().delete(asset).where(eq(asset.id, id));
}

export async function getAsset(id: string) {
  const [record] = await getDatabase().select().from(asset).where(eq(asset.id, id)).limit(1);
  const object = await getBucket().get(id);

  if (!object && record) await getDatabase().delete(asset).where(eq(asset.id, id));
  return { object, record };
}
