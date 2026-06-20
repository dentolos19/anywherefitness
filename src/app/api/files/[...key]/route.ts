import { getAsset } from "@/lib/database/assets";
import { authError, requireUser } from "@/lib/database/auth";

export async function GET(request: Request, context: { params: { key: string[] } }) {
  try {
    await requireUser(request);
    const { object, record } = await getAsset(context.params.key.join("/"));
    if (!object) return new Response("File not found.", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "private, max-age=3600");
    headers.set("Content-Length", object.size.toString());
    headers.set("ETag", object.httpEtag);
    if (record?.type) headers.set("Content-Type", record.type);
    else if (!headers.has("Content-Type")) headers.set("Content-Type", "application/octet-stream");
    return new Response(object.body, { headers });
  } catch (error) {
    return authError(error);
  }
}
