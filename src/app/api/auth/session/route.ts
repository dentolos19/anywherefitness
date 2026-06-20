import { deleteSession, getSessionUser } from "@/lib/database/auth";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });
    return Response.json(user);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to restore the session." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    return new Response(null, { headers: { "Set-Cookie": await deleteSession(request) }, status: 204 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Unable to log out." }, { status: 500 });
  }
}
