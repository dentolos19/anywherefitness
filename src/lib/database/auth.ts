import { and, eq, gt } from "drizzle-orm";

import { session, user } from "@/lib/database/schema";
import { getDatabase } from "@/lib/database/server";

const COOKIE_NAME = "anywherefitness_session";
const ITERATIONS = 100_000;
const SESSION_AGE = 60 * 60 * 24 * 30;

const decode = (value: string) => {
  const base64 = value
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};
const encode = (value: ArrayBuffer | Uint8Array) => {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  return encode(await crypto.subtle.digest("SHA-256", bytes));
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits(
    { hash: "SHA-256", iterations: ITERATIONS, name: "PBKDF2", salt },
    key,
    256,
  );
  return `pbkdf2_sha256$${ITERATIONS}$${encode(salt)}$${encode(hash)}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, iterationValue, saltValue, expectedValue] = encoded.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationValue || !saltValue || !expectedValue) return false;
  const iterations = Number(iterationValue);
  if (!Number.isInteger(iterations) || iterations < 1 || iterations > ITERATIONS) return false;

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const actual = new Uint8Array(
    await crypto.subtle.deriveBits({ hash: "SHA-256", iterations, name: "PBKDF2", salt: decode(saltValue) }, key, 256),
  );
  const expected = decode(expectedValue);
  if (actual.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < actual.length; index++) difference |= actual[index] ^ expected[index];
  return difference === 0;
}

function getToken(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  return cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === COOKIE_NAME)?.[1];
}

function getCookie(request: Request, token: string, maxAge: number) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

export async function createSession(request: Request, userId: string) {
  const token = encode(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_AGE;
  await getDatabase()
    .insert(session)
    .values({ expiresAt, tokenHash: await digest(token), userId });
  return getCookie(request, token, SESSION_AGE);
}

export async function deleteSession(request: Request) {
  const token = getToken(request);
  if (token)
    await getDatabase()
      .delete(session)
      .where(eq(session.tokenHash, await digest(token)));
  return getCookie(request, "", 0);
}

export async function getSessionUser(request: Request) {
  const token = getToken(request);
  if (!token) return undefined;

  const [record] = await getDatabase()
    .select({
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      name: user.name,
      username: user.username,
    })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(and(eq(session.tokenHash, await digest(token)), gt(session.expiresAt, Math.floor(Date.now() / 1000))))
    .limit(1);
  return record;
}

export async function requireUser(request: Request) {
  const record = await getSessionUser(request);
  if (!record) throw new Error("Authentication required.");
  return record;
}

export function authError(error: unknown) {
  if (error instanceof Error && error.message === "Authentication required.") {
    return Response.json({ error: error.message }, { status: 401 });
  }
  console.error(error);
  return Response.json({ error: "An unexpected server error occurred." }, { status: 500 });
}
