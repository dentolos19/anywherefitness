import PocketBase from "pocketbase";

import { Goal, Workout } from "@/lib/types";

const database = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
database.autoCancellation(false);

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
};

export type Post = {
  id: string;
  author: string;
  message: string;
  cover: string;
  created: Date;
  expand: {
    author: User;
  };
};

export type Advertisement = {
  id: string;
  author: string;
  title: string;
  description: string;
  created: Date;
  expand: {
    author: User;
  };
};

export type Profile = {
  id: string;
  user: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
  workouts?: Workout[];
  goals?: Goal[];
};

export function checkUser() {
  return database.authStore.isValid;
}

export function getUser() {
  return database.authStore.model as unknown as User;
}

export function updateUser(form: FormData) {
  return database.collection("users").update<User>(getUser().id, form, {
    expand: "author",
  });
}

export function loginUser(data: { username: string; password: string }) {
  return database.collection("users").authWithPassword<User>(data.username, data.password);
}

export function logoutUser() {
  database.authStore.clear();
}

export function registerUser(data: { name: string; username: string; email: string; password: string }) {
  return database.collection("users").create<User>({
    ...data,
    passwordConfirm: data.password,
  });
}

export function createPost(data: { message: string; cover?: File }) {
  const form = new FormData();
  form.append("author", getUser().id);
  form.append("message", data.message);
  if (data.cover) form.append("cover", data.cover);
  return database.collection("posts").create<Post>(form, {
    expand: "author",
  });
}

export function deletePost(id: string) {
  return database.collection("posts").delete(id);
}

export function getPosts() {
  return database.collection("posts").getList<Post>(1, 20, {
    sort: "-created",
    expand: "author",
  });
}

export function createAdvertisement(data: { title: string; description: string }) {
  const form = new FormData();
  form.append("author", getUser().id);
  form.append("title", data.title);
  form.append("description", data.description);
  return database.collection("advertisements").create<Advertisement>(form, {
    expand: "author",
  });
}

export function deleteAdvertisement(id: string) {
  return database.collection("advertisements").delete(id);
}

export function getAdvertisements() {
  return database.collection("advertisements").getList<Advertisement>(1, 20, {
    sort: "-created",
    expand: "author",
  });
}

export function createProfile(userId: string) {
  return database.collection("profiles").create<Profile>({
    user: userId,
    data: {},
    statistics: {},
    settings: {},
  });
}

export function getProfile(userId: string) {
  return database
    .collection("profiles")
    .getFirstListItem<Profile>(`user.id='${userId}'`)
    .then(
      (profile) => profile,
      (error) => {
        if (error.status === 404) {
          return createProfile(userId);
        }
        throw error;
      },
    );
}

export function updateProfile(id: string, data: Partial<Omit<Profile, "id" | "user">>) {
  return database.collection("profiles").update<Profile>(id, data);
}

export function getFileUrl(record: { id: string }, fileName: string) {
  return database.files.getUrl(record, fileName);
}
