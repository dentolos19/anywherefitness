import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = () => ({
  createdAt: text("created_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$default(() => new Date().toISOString())
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
});

export const asset = sqliteTable("assets", {
  ...timestamps(),
  hash: text("hash").notNull(),
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
});

export const user = sqliteTable("users", {
  avatar: text("avatar").default("").notNull(),
  ...timestamps(),
  email: text("email").unique().notNull(),
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  username: text("username").unique().notNull(),
});

export const session = sqliteTable("sessions", {
  createdAt: text("created_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const post = sqliteTable("posts", {
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  cover: text("cover").default("").notNull(),
  createdAt: text("created_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  message: text("message").notNull(),
});

export const advertisement = sqliteTable("advertisements", {
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .$default(() => new Date().toISOString())
    .notNull(),
  description: text("description").notNull(),
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  title: text("title").notNull(),
});

export const profile = sqliteTable("profiles", {
  ...timestamps(),
  goals: text("goals", { mode: "json" }).$type<unknown[]>().default([]).notNull(),
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  settings: text("settings", { mode: "json" }).$type<Record<string, unknown>>().default({}).notNull(),
  userId: text("user_id")
    .unique()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  workouts: text("workouts", { mode: "json" }).$type<unknown[]>().default([]).notNull(),
});
