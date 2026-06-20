import { and, eq } from "drizzle-orm";

import { authError, requireUser } from "@/lib/database/auth";
import { profile } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";
import { Goal, Workout } from "@/lib/types";

const format = (record: typeof profile.$inferSelect) => ({
  goals: record.goals as Goal[],
  id: record.id,
  settings: record.settings,
  user: record.userId,
  workouts: record.workouts as Workout[],
});

export async function GET(request: Request) {
  try {
    const currentUser = await requireUser(request);
    const userId = new URL(request.url).searchParams.get("userId");
    if (userId !== currentUser.id) return Response.json({ error: "Profile access is denied." }, { status: 403 });

    const database = getDatabase();
    let [record] = await database.select().from(profile).where(eq(profile.userId, currentUser.id)).limit(1);
    if (!record) {
      [record] = await database.insert(profile).values({ userId: currentUser.id }).returning();
    }
    return Response.json(format(record));
  } catch (error) {
    return authError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireUser(request);
    const data = (await request.json()) as {
      goals?: Goal[];
      id?: unknown;
      settings?: Record<string, unknown>;
      workouts?: Workout[];
    };
    if (typeof data.id !== "string") return Response.json({ error: "A profile ID is required." }, { status: 400 });

    const [record] = await getDatabase()
      .update(profile)
      .set({ goals: data.goals, settings: data.settings, workouts: data.workouts })
      .where(and(eq(profile.id, data.id), eq(profile.userId, currentUser.id)))
      .returning();
    if (!record) return Response.json({ error: "Profile not found." }, { status: 404 });
    return Response.json(format(record));
  } catch (error) {
    return authError(error);
  }
}
