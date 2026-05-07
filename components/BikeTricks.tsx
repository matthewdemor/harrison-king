"use client";

import { useEffect, useState } from "react";

type Trick = { name: string; desc: string; level: 1 | 2 | 3 | 4 | 5 };

const TRICKS: Trick[] = [
  { name: "Going Fast", desc: "Establishing dominance over the wind itself.", level: 1 },
  { name: "Bunny Hop", desc: "Both wheels off the ground at the same time. Like a kangaroo.", level: 2 },
  { name: "Wheelie", desc: "Front wheel up, rear wheel down. Pop a stand and ride!", level: 3 },
  { name: "Skid", desc: "Lock up the back brake. Leave a stripe. Look cool.", level: 1 },
  { name: "Curb Hop", desc: "Lift the front, then the back, and you're up.", level: 2 },
  { name: "180 Spin", desc: "Half-rotation while in the air. Land facing the way you came.", level: 4 },
  { name: "Manual", desc: "Wheelie without pedaling. Pure balance. Pure attitude.", level: 4 },
  { name: "Bar Spin", desc: "Spin the handlebars in mid-air. For pros only.", level: 5 },
  { name: "Tabletop", desc: "Lay the bike flat in the air. Looks like a flying pancake.", level: 5 },
];

const STAR = "★";
const EMPTY_STAR = "☆";

const STORAGE_KEY = "hk-tricks-done";

export function BikeTricks() {
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

  const totalDone = Object.values(done).filter(Boolean).length;

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-red text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          🚴 Harry&apos;s Bike Trick List
        </h2>
        <p className="font-body text-ink/70 text-center mb-6 text-[0.95rem]">
          Tap a trick to mark it &ldquo;tried it!&rdquo; — {totalDone}/{TRICKS.length} done
        </p>

        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 max-w-[760px] mx-auto">
          {TRICKS.map((t, i) => {
            const isDone = !!done[t.name];
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => toggle(t.name)}
                className={`text-left flex items-start gap-4 px-4 py-4 border-[3px] border-ink rounded-[18px] active:translate-x-[2px] active:translate-y-[2px] ${
                  isDone ? "bg-grass" : "bg-white"
                }`}
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                }}
              >
                <span
                  className={`mt-1 inline-flex items-center justify-center text-[1.4rem] w-9 h-9 rounded-md border-[3px] border-ink ${
                    isDone ? "bg-sun" : "bg-white"
                  }`}
                  aria-hidden
                >
                  {isDone ? "✓" : ""}
                </span>
                <span className="flex-1">
                  <span
                    className="font-display block text-ink leading-none mb-1"
                    style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
                  >
                    {t.name}
                  </span>
                  <span className="font-body text-ink/80 text-[0.95rem] block">
                    {t.desc}
                  </span>
                  <span className="font-body text-red text-[0.95rem] mt-1 block tracking-wider">
                    {STAR.repeat(t.level)}
                    <span className="text-ink/40">{EMPTY_STAR.repeat(5 - t.level)}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
