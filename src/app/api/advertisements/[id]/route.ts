import { and, eq } from "drizzle-orm";

import { authError, requireUser } from "@/lib/database/auth";
import { advertisement } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const currentUser = await requireUser(request);
    const [record] = await getDatabase()
      .delete(advertisement)
      .where(and(eq(advertisement.id, context.params.id), eq(advertisement.authorId, currentUser.id)))
      .returning();
    if (!record) return Response.json({ error: "Advertisement not found." }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    return authError(error);
  }
}
