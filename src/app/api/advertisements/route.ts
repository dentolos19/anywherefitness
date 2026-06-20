import { desc, eq } from "drizzle-orm";

import { authError, requireUser } from "@/lib/database/auth";
import { advertisement, user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function GET(request: Request) {
  try {
    await requireUser(request);
    const records = await getDatabase()
      .select({
        author: advertisement.authorId,
        authorAvatar: user.avatar,
        authorEmail: user.email,
        authorId: user.id,
        authorName: user.name,
        authorUsername: user.username,
        created: advertisement.createdAt,
        description: advertisement.description,
        id: advertisement.id,
        title: advertisement.title,
      })
      .from(advertisement)
      .innerJoin(user, eq(advertisement.authorId, user.id))
      .orderBy(desc(advertisement.createdAt))
      .limit(20);

    return Response.json({
      items: records.map((record) => ({
        author: record.author,
        created: record.created,
        description: record.description,
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
        title: record.title,
      })),
    });
  } catch (error) {
    return authError(error);
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireUser(request);
    const data = (await request.json()) as { description?: unknown; title?: unknown };
    const description = typeof data.description === "string" ? data.description.trim() : "";
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (!description || !title) {
      return Response.json({ error: "A title and description are required." }, { status: 400 });
    }

    const [record] = await getDatabase()
      .insert(advertisement)
      .values({ authorId: currentUser.id, description, title })
      .returning();
    return Response.json(
      {
        author: record.authorId,
        created: record.createdAt,
        description: record.description,
        expand: { author: currentUser },
        id: record.id,
        title: record.title,
      },
      { status: 201 },
    );
  } catch (error) {
    return authError(error);
  }
}
