import { type NextRequest } from "next/server";
import { submitScore, fetchTopScores } from "@/lib/firebase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 8000;
const recentByIp = new Map<string, number>();

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();
  const last = recentByIp.get(ip) ?? 0;
  if (now - last < RATE_LIMIT_WINDOW_MS) {
    return Response.json(
      { error: "Slow down, you're scoring too fast! Try again in a few seconds." },
      { status: 429 },
    );
  }
  recentByIp.set(ip, now);

  if (recentByIp.size > 5000) {
    for (const [k, v] of recentByIp) {
      if (now - v > 5 * 60 * 1000) recentByIp.delete(k);
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const result = await submitScore({
    player_name: String(b.player_name ?? ""),
    score: Number(b.score ?? 0),
    flags_collected: Number(b.flags_collected ?? 0),
    defeated_boss: Boolean(b.defeated_boss),
  });

  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const top = await fetchTopScores(10);
  return Response.json({ ok: true, id: result.id, top });
}

export async function GET() {
  const top = await fetchTopScores(10);
  return Response.json({ top });
}
