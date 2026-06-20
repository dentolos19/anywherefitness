import { eq } from "drizzle-orm";

import { createSession, verifyPassword } from "@/lib/database/auth";
import { user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as { password?: unknown; username?: unknown };
    if (typeof data.password !== "string" || typeof data.username !== "string") {
      return Response.json({ error: "A username and password are required." }, { status: 400 });
    }

    const [record] = await getDatabase()
      .select()
      .from(user)
      .where(eq(user.username, data.username.trim().toLowerCase()))
      .limit(1);
    if (!record || !(await verifyPassword(data.password, record.passwordHash))) {
      return Response.json({ error: "The username or password is incorrect." }, { status: 401 });
    }

    const cookie = await createSession(request, record.id);
    return Response.json(
      {
        avatar: record.avatar,
        email: record.email,
        id: record.id,
        name: record.name,
        username: record.username,
      },
      { headers: { "Set-Cookie": cookie } },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to log in." }, { status: 500 });
  }
}
