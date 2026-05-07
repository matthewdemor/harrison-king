/**
 * Server-side Firestore access via the public REST API.
 *
 * The Firebase Web SDK uses gRPC streams that fall over in Node-style serverless
 * runtimes (RST_STREAM / EHOSTUNREACH errors), so we hit the documented REST endpoint
 * directly with `fetch`. The rules locked down `/leaderboard` so only writes that
 * pass schema validation are accepted; rate limiting happens in the route handler.
 */

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

const DB_BASE = PROJECT_ID
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`
  : "";

export type LeaderboardEntry = {
  id: string;
  player_name: string;
  score: number;
  flags_collected: number;
  defeated_boss: boolean;
  created_at: number;
};

type FsValue =
  | { stringValue: string }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null };

type FsDocument = {
  name: string;
  fields?: Record<string, FsValue>;
  createTime?: string;
  updateTime?: string;
};

function fieldsToEntry(name: string, fields: Record<string, FsValue> = {}): LeaderboardEntry {
  const id = name.split("/").pop() ?? "";
  const get = <K extends keyof FsValue>(k: string): FsValue | undefined => fields[k];
  void get;
  const player_name =
    "stringValue" in (fields.player_name ?? {})
      ? (fields.player_name as { stringValue: string }).stringValue
      : "";
  const score =
    "integerValue" in (fields.score ?? {})
      ? Number((fields.score as { integerValue: string }).integerValue)
      : 0;
  const flags_collected =
    "integerValue" in (fields.flags_collected ?? {})
      ? Number((fields.flags_collected as { integerValue: string }).integerValue)
      : 0;
  const defeated_boss =
    "booleanValue" in (fields.defeated_boss ?? {})
      ? (fields.defeated_boss as { booleanValue: boolean }).booleanValue
      : false;
  const created_at =
    "timestampValue" in (fields.created_at ?? {})
      ? new Date((fields.created_at as { timestampValue: string }).timestampValue).getTime()
      : 0;

  return { id, player_name, score, flags_collected, defeated_boss, created_at };
}

export async function fetchTopScores(n = 10): Promise<LeaderboardEntry[]> {
  if (!DB_BASE || !API_KEY) return [];
  const body = {
    structuredQuery: {
      from: [{ collectionId: "leaderboard" }],
      orderBy: [
        { field: { fieldPath: "score" }, direction: "DESCENDING" },
        { field: { fieldPath: "created_at" }, direction: "DESCENDING" },
      ],
      limit: n,
    },
  };

  try {
    const res = await fetch(`${DB_BASE}:runQuery?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ document?: FsDocument }>;
    return data
      .filter((row) => row.document)
      .map((row) => fieldsToEntry(row.document!.name, row.document!.fields))
      .sort((a, b) => b.score - a.score || b.created_at - a.created_at);
  } catch {
    return [];
  }
}

export async function submitScore(input: {
  player_name: string;
  score: number;
  flags_collected: number;
  defeated_boss: boolean;
}): Promise<{ id: string } | { error: string }> {
  if (!DB_BASE || !API_KEY) {
    return { error: "Server is not configured (missing Firebase env vars)" };
  }

  const cleanName = String(input.player_name ?? "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .slice(0, 20);
  if (!cleanName) return { error: "Invalid player name" };

  const score = Math.max(0, Math.min(99999, Math.floor(Number(input.score) || 0)));
  const flags = Math.max(0, Math.min(5, Math.floor(Number(input.flags_collected) || 0)));
  const beat = Boolean(input.defeated_boss);

  const body = {
    fields: {
      player_name: { stringValue: cleanName },
      score: { integerValue: String(score) },
      flags_collected: { integerValue: String(flags) },
      defeated_boss: { booleanValue: beat },
      created_at: { timestampValue: new Date().toISOString() },
    },
  };

  try {
    const res = await fetch(`${DB_BASE}/leaderboard?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      let detail = "";
      try {
        const j = await res.json();
        detail = j?.error?.message ?? "";
      } catch {}
      return { error: detail || `Firestore write failed (${res.status})` };
    }
    const doc = (await res.json()) as FsDocument;
    return { id: doc.name.split("/").pop() ?? "" };
  } catch (e) {
    return { error: (e as Error).message ?? "Network error" };
  }
}
