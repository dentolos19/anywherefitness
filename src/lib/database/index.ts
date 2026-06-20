"use client";

import { Goal, Workout } from "@/lib/types";

export type User = {
  avatar: string;
  email: string;
  id: string;
  name: string;
  username: string;
};

export type Post = {
  author: string;
  cover: string;
  created: string;
  expand: { author: User };
  id: string;
  message: string;
};

export type Advertisement = {
  author: string;
  created: string;
  description: string;
  expand: { author: User };
  id: string;
  title: string;
};

export type Profile = {
  goals?: Goal[];
  id: string;
  settings?: Record<string, unknown>;
  user: string;
  workouts?: Workout[];
};

async function request<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
    throw new Error(body?.error || `Request failed with status ${response.status}.`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function getUser() {
  const response = await fetch("/api/auth/session");
  if (response.status === 401) return undefined;
  if (!response.ok) throw new Error("Unable to load the current user.");
  return (await response.json()) as User;
}

export function updateUser(form: FormData) {
  return request<User>("/api/users/me", { body: form, method: "PATCH" });
}

export function loginUser(data: { password: string; username: string }) {
  return request<User>("/api/auth/login", {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

export function logoutUser() {
  return request<void>("/api/auth/session", { method: "DELETE" });
}

export function registerUser(data: { email: string; name: string; password: string; username: string }) {
  return request<User>("/api/auth/register", {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

export function createPost(data: { cover?: File; message: string }) {
  const form = new FormData();
  form.append("message", data.message);
  if (data.cover) form.append("cover", data.cover);
  return request<Post>("/api/posts", { body: form, method: "POST" });
}

export function deletePost(id: string) {
  return request<void>(`/api/posts/${id}`, { method: "DELETE" });
}

export function getPosts() {
  return request<{ items: Post[] }>("/api/posts");
}

export function createAdvertisement(data: { description: string; title: string }) {
  return request<Advertisement>("/api/advertisements", {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

export function deleteAdvertisement(id: string) {
  return request<void>(`/api/advertisements/${id}`, { method: "DELETE" });
}

export function getAdvertisements() {
  return request<{ items: Advertisement[] }>("/api/advertisements");
}

export function getProfile(userId: string) {
  return request<Profile>(`/api/profile?userId=${encodeURIComponent(userId)}`);
}

export function updateProfile(id: string, data: Partial<Omit<Profile, "id" | "user">>) {
  return request<Profile>("/api/profile", {
    body: JSON.stringify({ ...data, id }),
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
  });
}

export function getFileUrl(_record: { id: string }, fileName: string) {
  const path = fileName
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/api/files/${path}`;
}
