import { createSession, hashPassword } from "@/lib/database/auth";
import { profile, user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const password = typeof data.password === "string" ? data.password : "";
    const username = typeof data.username === "string" ? data.username.trim().toLowerCase() : "";

    if (!email || !name || password.length < 8 || !username) {
      return Response.json(
        { error: "Complete every field and use a password with at least eight characters." },
        { status: 400 },
      );
    }

    const id = crypto.randomUUID();
    const database = getDatabase();
    await database.batch([
      database
        .insert(user)
        .values({ email, id, name, passwordHash: await hashPassword(password), username })
        .returning(),
      database.insert(profile).values({ id: crypto.randomUUID(), userId: id }).returning(),
    ]);

    const cookie = await createSession(request, id);
    return Response.json({ avatar: "", email, id, name, username }, { headers: { "Set-Cookie": cookie }, status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return Response.json({ error: "That username or email is already registered." }, { status: 409 });
    }
    console.error(error);
    return Response.json({ error: "Unable to register." }, { status: 500 });
  }
}
