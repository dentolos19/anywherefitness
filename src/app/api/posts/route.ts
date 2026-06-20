import { desc, eq } from "drizzle-orm";

import { createAsset, deleteAsset, MAX_ASSET_SIZE } from "@/lib/database/assets";
import { authError, requireUser } from "@/lib/database/auth";
import { post, user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

const fields = {
  author: post.authorId,
  authorAvatar: user.avatar,
  authorEmail: user.email,
  authorId: user.id,
  authorName: user.name,
  authorUsername: user.username,
  cover: post.cover,
  created: post.createdAt,
  id: post.id,
  message: post.message,
};

const format = (record: Awaited<ReturnType<typeof list>>[number]) => ({
  author: record.author,
  cover: record.cover,
  created: record.created,
  expand: {
    author: {
      avatar: record.authorAvatar,
      email: record.authorEmail,
      id: record.authorId,
      name: record.authorName,
      username: record.authorUsername,
    },
  },
  id: record.id,
  message: record.message,
});

async function list() {
  return getDatabase()
    .select(fields)
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .orderBy(desc(post.createdAt))
    .limit(20);
}

export async function GET(request: Request) {
  try {
    await requireUser(request);
    return Response.json({ items: (await list()).map(format) });
  } catch (error) {
    return authError(error);
  }
}

export async function POST(request: Request) {
  let cover = "";

  try {
    const currentUser = await requireUser(request);
    const form = await request.formData();
    const coverFile = form.get("cover");
    const message = form.get("message");
    if (typeof message !== "string" || !message.trim()) {
      return Response.json({ error: "A message is required." }, { status: 400 });
    }

    if (coverFile instanceof File && coverFile.size > 0) {
      if (!coverFile.type.startsWith("image/")) {
        return Response.json({ error: "The post cover must be an image." }, { status: 400 });
      }
      if (coverFile.size > MAX_ASSET_SIZE) {
        return Response.json({ error: "The post cover must be no larger than 50 MB." }, { status: 400 });
      }
      cover = (await createAsset(coverFile)).id;
    }

    const [record] = await getDatabase()
      .insert(post)
      .values({ authorId: currentUser.id, cover, message: message.trim() })
      .returning();
    return Response.json(
      {
        author: record.authorId,
        cover: record.cover,
        created: record.createdAt,
        expand: { author: currentUser },
        id: record.id,
        message: record.message,
      },
      { status: 201 },
    );
  } catch (error) {
    if (cover) await deleteAsset(cover).catch(() => undefined);
    return authError(error);
  }
}
