"use client";

import { useEffect, useState } from "react";

const ITEMS: Array<{ emoji: string; name: string }> = [
  { emoji: "🏊", name: "Swim past the buoys" },
  { emoji: "🏖️", name: "Build the world's biggest sandcastle" },
  { emoji: "🐚", name: "Find 10 cool seashells" },
  { emoji: "🌊", name: "Body-surf a really big wave" },
  { emoji: "🦀", name: "Spot a crab in the sand" },
  { emoji: "🍦", name: "Eat ice cream before it melts" },
  { emoji: "🏐", name: "Win a beach volleyball point" },
  { emoji: "🦅", name: "Feed (or scare!) a seagull" },
  { emoji: "🪁", name: "Fly a kite" },
  { emoji: "🌅", name: "Watch the sunset" },
  { emoji: "🐬", name: "See a dolphin" },
  { emoji: "🏝️", name: "Bury someone in sand (gently!)" },
];

const STORAGE_KEY = "hk-beach-checklist";

export function BeachChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (name: string) => {
    setDone((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const total = ITEMS.length;
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / total) * 100);

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-sky-deep text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          🏖️ Beach Day Bucket List
        </h2>
        <p className="font-body text-ink/70 text-center mb-2 text-[0.95rem]">
          Tap each one Harry has actually done!
        </p>
        <div
          className="mx-auto mb-6 h-5 rounded-full border-[3px] border-ink overflow-hidden bg-white max-w-[600px]"
          aria-hidden
        >
          <div
            className="h-full bg-grass-deep transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="font-display text-ink text-center mb-6 text-[1.1rem]">
          {count}/{total} done · {pct}% beach mastered
        </p>

        <div
          className="grid gap-3 max-w-[760px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {ITEMS.map((item, i) => {
            const isDone = !!done[item.name];
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggle(item.name)}
                className={`flex items-center gap-3 border-[3px] border-ink rounded-[16px] px-4 py-3 active:translate-x-[2px] active:translate-y-[2px] ${
                  isDone ? "bg-grass" : "bg-white"
                }`}
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                }}
              >
                <span className="text-[1.7rem]" aria-hidden>
                  {item.emoji}
                </span>
                <span className="font-body text-ink text-[1rem] flex-1 text-left leading-tight">
                  {item.name}
                </span>
                <span
                  className={`text-[1.2rem] ${
                    isDone ? "text-grass-deep" : "text-ink/30"
                  }`}
                  aria-hidden
                >
                  {isDone ? "✓" : "○"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
