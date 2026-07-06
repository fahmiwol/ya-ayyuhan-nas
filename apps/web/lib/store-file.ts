// apps/web/lib/store-file.ts — backend file JSON (dev lokal, tanpa Postgres).
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Store, StoreUser, StoreNote, ContentReview } from "./store";

const DIR = path.join(process.cwd(), ".data");
const USERS = path.join(DIR, "users.json");
const NOTES = path.join(DIR, "notes.json");
const REVIEWS = path.join(DIR, "reviews.json");

async function read<T>(file: string): Promise<T[]> {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return []; }
}
async function write<T>(file: string, data: T[]): Promise<void> {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export class FileStore implements Store {
  async init() { await fs.mkdir(DIR, { recursive: true }); }

  async getUserByEmail(email: string) {
    return (await read<StoreUser>(USERS)).find((u) => u.email === email) ?? null;
  }
  async getUserById(id: string) {
    return (await read<StoreUser>(USERS)).find((u) => u.id === id) ?? null;
  }
  async countUsers() { return (await read<StoreUser>(USERS)).length; }
  async createUser(u: StoreUser) {
    const users = await read<StoreUser>(USERS);
    users.push(u);
    await write(USERS, users);
  }

  async listNotes(userId: string) {
    return (await read<StoreNote>(NOTES)).filter((n) => n.userId === userId)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }
  async upsertNote(n: StoreNote) {
    const notes = await read<StoreNote>(NOTES);
    const i = notes.findIndex((x) => x.id === n.id && x.userId === n.userId);
    if (i >= 0) notes[i] = n; else notes.push(n);
    await write(NOTES, notes);
  }
  async deleteNote(userId: string, id: string) {
    const notes = await read<StoreNote>(NOTES);
    await write(NOTES, notes.filter((n) => !(n.id === id && n.userId === userId)));
  }

  async listReviews() {
    return (await read<ContentReview>(REVIEWS)).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }
  async upsertReview(r: ContentReview) {
    const reviews = await read<ContentReview>(REVIEWS);
    const i = reviews.findIndex((x) => x.ref === r.ref);
    if (i >= 0) reviews[i] = r; else reviews.push(r);
    await write(REVIEWS, reviews);
  }
}
