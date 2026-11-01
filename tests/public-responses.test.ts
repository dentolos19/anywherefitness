import { expect, mock, test } from "bun:test";

const currentUser = { id: "user", name: "User", username: "user", avatar: "", email: "private@example.com" };
const row = {
  author: currentUser.id,
  authorId: currentUser.id,
  authorAvatar: currentUser.avatar,
  authorEmail: currentUser.email,
  authorName: currentUser.name,
  authorUsername: currentUser.username,
  id: "record",
  created: "2026-01-01",
  createdAt: "2026-01-01",
  cover: "",
  message: "Hello",
  title: "Title",
  description: "Description",
};

const query = {
  from: () => query,
  innerJoin: () => query,
  orderBy: () => query,
  limit: async () => [row],
  values: () => query,
  returning: async () => [row],
};
mock.module("@/lib/database/server", () => ({ getDatabase: () => ({ select: () => query, insert: () => query }) }));
mock.module("@/lib/database/auth", () => ({
  requireUser: async () => currentUser,
  authError: () => new Response(null, { status: 500 }),
}));
mock.module("@/lib/database/assets", () => ({
  MAX_ASSET_SIZE: 50 * 1024 * 1024,
  createAsset: async () => ({ id: "asset" }),
  deleteAsset: async () => {},
  getAsset: async () => ({
    record: { type: "image/svg+xml" },
    object: {
      body: new ReadableStream({ start: (controller) => controller.close() }),
      size: 0,
      httpEtag: '"test"',
      writeHttpMetadata: () => {},
    },
  }),
}));

const posts = await import("../src/app/api/posts/route");
const advertisements = await import("../src/app/api/advertisements/route");
const files = await import("../src/app/api/files/[...key]/route");

test("post and advertisement responses exclude author email", async () => {
  const form = new FormData();
  form.set("message", "Hello");
  const responses = await Promise.all([
    posts.GET(new Request("https://example.com/api/posts")),
    posts.POST(new Request("https://example.com/api/posts", { method: "POST", body: form })),
    advertisements.GET(new Request("https://example.com/api/advertisements")),
    advertisements.POST(
      new Request("https://example.com/api/advertisements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Title", description: "Description" }),
      }),
    ),
  ]);
  for (const response of responses) {
    expect(response.ok).toBe(true);
    expect(await response.text()).not.toContain(currentUser.email);
  }
});

test("uploaded files cannot execute as same-origin documents", async () => {
  const response = await files.GET(new Request("https://example.com/api/files/test"), { params: { key: ["test"] } });
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
  expect(response.headers.get("Content-Security-Policy")).toBe("sandbox");
  expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
});
