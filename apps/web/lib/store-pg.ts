// apps/web/lib/store-pg.ts — backend Postgres (produksi/Docker, scalable).
// Skema dibuat otomatis (CREATE TABLE IF NOT EXISTS). Query ter-parameter (anti SQLi).
import { Pool } from "pg";
import type { Store, StoreUser, StoreNote, Role, ContentReview } from "./store";

export class PgStore implements Store {
  private pool: Pool;
  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString, max: 10 });
  }

  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS app_user (
        id           TEXT PRIMARY KEY,
        name         TEXT NOT NULL,
        email        TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role         TEXT NOT NULL DEFAULT 'user',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS user_note (
        id         TEXT NOT NULL,
        user_id    TEXT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
        surah      INT NOT NULL,
        ayah       INT NOT NULL,
        word       INT,
        color      TEXT NOT NULL,
        type       TEXT NOT NULL,
        note       TEXT NOT NULL,
        source     JSONB,
        ayah_hash  TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, id)
      );
      CREATE INDEX IF NOT EXISTS idx_note_user ON user_note(user_id);
      CREATE TABLE IF NOT EXISTS content_review (
        ref          TEXT PRIMARY KEY,
        kind         TEXT NOT NULL,
        decision     TEXT NOT NULL,
        status_override TEXT,
        note         TEXT,
        reviewer_id  TEXT NOT NULL,
        reviewer_name TEXT NOT NULL,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  private toReview(r: Record<string, unknown>): ContentReview {
    return {
      ref: r.ref as string, kind: r.kind as string, decision: r.decision as ContentReview["decision"],
      statusOverride: (r.status_override as string) ?? null, note: (r.note as string) ?? null,
      reviewerId: r.reviewer_id as string, reviewerName: r.reviewer_name as string,
      createdAt: new Date(r.created_at as string).toISOString(), updatedAt: new Date(r.updated_at as string).toISOString(),
    };
  }
  async listReviews() {
    const { rows } = await this.pool.query("SELECT * FROM content_review ORDER BY updated_at DESC");
    return rows.map((r) => this.toReview(r));
  }
  async upsertReview(r: ContentReview) {
    await this.pool.query(
      `INSERT INTO content_review (ref,kind,decision,status_override,note,reviewer_id,reviewer_name,created_at,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (ref) DO UPDATE SET
         kind=$2, decision=$3, status_override=$4, note=$5, reviewer_id=$6, reviewer_name=$7, updated_at=$9`,
      [r.ref, r.kind, r.decision, r.statusOverride, r.note, r.reviewerId, r.reviewerName, r.createdAt, r.updatedAt]
    );
  }

  private toUser(r: Record<string, unknown>): StoreUser {
    return {
      id: r.id as string, name: r.name as string, email: r.email as string,
      passwordHash: r.password_hash as string, role: r.role as Role,
      createdAt: new Date(r.created_at as string).toISOString(),
    };
  }

  async getUserByEmail(email: string) {
    const { rows } = await this.pool.query("SELECT * FROM app_user WHERE email=$1", [email]);
    return rows[0] ? this.toUser(rows[0]) : null;
  }
  async getUserById(id: string) {
    const { rows } = await this.pool.query("SELECT * FROM app_user WHERE id=$1", [id]);
    return rows[0] ? this.toUser(rows[0]) : null;
  }
  async countUsers() {
    const { rows } = await this.pool.query("SELECT COUNT(*)::int AS n FROM app_user");
    return rows[0].n as number;
  }
  async createUser(u: StoreUser) {
    await this.pool.query(
      "INSERT INTO app_user (id,name,email,password_hash,role,created_at) VALUES ($1,$2,$3,$4,$5,$6)",
      [u.id, u.name, u.email, u.passwordHash, u.role, u.createdAt]
    );
  }

  private toNote(r: Record<string, unknown>): StoreNote {
    return {
      id: r.id as string, userId: r.user_id as string, surah: r.surah as number, ayah: r.ayah as number,
      word: (r.word as number) ?? null, color: r.color as string, type: r.type as string, note: r.note as string,
      source: r.source, ayahHash: r.ayah_hash as string,
      createdAt: new Date(r.created_at as string).toISOString(), updatedAt: new Date(r.updated_at as string).toISOString(),
    };
  }

  async listNotes(userId: string) {
    const { rows } = await this.pool.query("SELECT * FROM user_note WHERE user_id=$1 ORDER BY updated_at DESC", [userId]);
    return rows.map((r) => this.toNote(r));
  }
  async upsertNote(n: StoreNote) {
    await this.pool.query(
      `INSERT INTO user_note (id,user_id,surah,ayah,word,color,type,note,source,ayah_hash,created_at,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (user_id,id) DO UPDATE SET
         surah=$3, ayah=$4, word=$5, color=$6, type=$7, note=$8, source=$9, ayah_hash=$10, updated_at=$12`,
      [n.id, n.userId, n.surah, n.ayah, n.word, n.color, n.type, n.note, JSON.stringify(n.source ?? null), n.ayahHash, n.createdAt, n.updatedAt]
    );
  }
  async deleteNote(userId: string, id: string) {
    await this.pool.query("DELETE FROM user_note WHERE user_id=$1 AND id=$2", [userId, id]);
  }
}
