import { eq } from "drizzle-orm";

import { createAsset, deleteAsset, MAX_ASSET_SIZE } from "@/lib/database/assets";
import { authError, requireUser } from "@/lib/database/auth";
import { user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function PATCH(request: Request) {
  let avatarId = "";

  try {
    const currentUser = await requireUser(request);
    const form = await request.formData();
    const avatar = form.get("avatar");
    const name = form.get("name");
    const updates: { avatar?: string; name?: string } = {};

    if (typeof name === "string" && name.trim()) updates.name = name.trim();
    if (avatar instanceof File && avatar.size > 0) {
      if (!avatar.type.startsWith("image/")) {
        return Response.json({ error: "The avatar must be an image." }, { status: 400 });
      }
      if (avatar.size > MAX_ASSET_SIZE) {
        return Response.json({ error: "The avatar must be no larger than 50 MB." }, { status: 400 });
      }
      avatarId = (await createAsset(avatar)).id;
      updates.avatar = avatarId;
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No account changes were provided." }, { status: 400 });
    }

    const [record] = await getDatabase().update(user).set(updates).where(eq(user.id, currentUser.id)).returning();
    avatarId = "";
    if (updates.avatar && currentUser.avatar) {
      await deleteAsset(currentUser.avatar).catch((error: unknown) =>
        console.error("Unable to delete the previous avatar.", error),
      );
    }

    return Response.json({
      avatar: record.avatar,
      email: record.email,
      id: record.id,
      name: record.name,
      username: record.username,
    });
  } catch (error) {
    if (avatarId)
      await deleteAsset(avatarId).catch((deleteError: unknown) =>
        console.error("Unable to delete the unused avatar.", deleteError),
      );
    return authError(error);
  }
}
