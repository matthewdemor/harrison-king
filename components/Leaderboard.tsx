"use client";

import { useEffect, useState } from "react";

type Entry = {
  id: string;
  player_name: string;
  score: number;
  flags_collected: number;
  defeated_boss: boolean;
};

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/score", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setEntries(data.top ?? []);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("leaderboard:refresh", handler);
    return () => {
      cancelled = true;
      window.removeEventListener("leaderboard:refresh", handler);
    };
  }, [refreshKey]);

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-red text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          Hall of Fame 🏆
        </h2>
        <p className="text-center mb-6 text-ink" style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}>
          Top dog-saving heroes of all time
        </p>

        {loading ? (
          <p className="text-center font-body text-ink">Loading scores…</p>
        ) : entries.length === 0 ? (
          <p className="text-center font-body text-ink">
            No scores yet — be the first to save the dogs!
          </p>
        ) : (
          <ol className="space-y-3 max-w-[600px] mx-auto">
            {entries.map((e, i) => {
              const isHarry = /harry|harrison/i.test(e.player_name);
              const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⭐";
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-3 bg-white border-[3px] border-ink rounded-[18px] px-4 py-3 font-body"
                  style={{
                    boxShadow: "var(--shadow-ink-sm)",
                    transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                  }}
                >
                  <span className="text-[1.6rem] w-9 text-center">{medal}</span>
                  <span className="font-bold text-ink text-[1.1rem] flex-1 truncate">
                    {isHarry && "👑 "}
                    {e.player_name}
                  </span>
                  {e.defeated_boss && <span title="Beat the boss!" className="text-[1.1rem]">🐾</span>}
                  <span className="text-grass-deep font-bold text-[1.1rem]">
                    🚩{e.flags_collected}/5
                  </span>
                  <span className="font-display text-red text-[1.4rem] tabular-nums min-w-[80px] text-right">
                    {e.score}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
