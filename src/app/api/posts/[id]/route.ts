import { and, eq } from "drizzle-orm";

import { deleteAsset } from "@/lib/database/assets";
import { authError, requireUser } from "@/lib/database/auth";
import { post } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const currentUser = await requireUser(request);
    const [record] = await getDatabase()
      .delete(post)
      .where(and(eq(post.id, context.params.id), eq(post.authorId, currentUser.id)))
      .returning();
    if (!record) return Response.json({ error: "Post not found." }, { status: 404 });
    if (record.cover) {
      await deleteAsset(record.cover).catch((error: unknown) =>
        console.error("Unable to delete the post cover.", error),
      );
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    return authError(error);
  }
}
