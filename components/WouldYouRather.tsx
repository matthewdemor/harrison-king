"use client";

import { useEffect, useState } from "react";

type Choice = {
  id: string;
  q: string;
  a: { emoji: string; label: string; color: string };
  b: { emoji: string; label: string; color: string };
};

const QUESTIONS: Choice[] = [
  {
    id: "bike-vs-swim",
    q: "Would you rather…",
    a: { emoji: "🚴", label: "Ride a bike SUPER fast", color: "bg-red" },
    b: { emoji: "🏊", label: "Swim through the deep end", color: "bg-sky-deep" },
  },
  {
    id: "hoop-vs-spiral",
    q: "Would you rather make…",
    a: { emoji: "🏀", label: "A half-court basketball shot", color: "bg-red-deep" },
    b: { emoji: "🏈", label: "A perfect 50-yard spiral", color: "bg-brown" },
  },
  {
    id: "homerun-vs-touchdown",
    q: "Best feeling ever:",
    a: { emoji: "⚾", label: "Hitting a home run", color: "bg-sky" },
    b: { emoji: "🏈", label: "Scoring a touchdown", color: "bg-grass-deep" },
  },
  {
    id: "dog-vs-puppy",
    q: "Pick your dog:",
    a: { emoji: "🐶", label: "A floppy puppy", color: "bg-brown" },
    b: { emoji: "🦮", label: "A big loyal pup", color: "bg-grass-deep" },
  },
  {
    id: "beach-vs-pool",
    q: "Best swim spot:",
    a: { emoji: "🏖️", label: "The actual ocean", color: "bg-sky-deep" },
    b: { emoji: "🏊", label: "The deep end of a pool", color: "bg-sky" },
  },
];

const STORAGE_KEY = "hk-wyr-votes";

export function WouldYouRather() {
  const [votes, setVotes] = useState<Record<string, "a" | "b">>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setVotes(JSON.parse(raw));
    } catch {}
  }, []);

  const vote = (id: string, choice: "a" | "b") => {
    setVotes((prev) => {
      const next = { ...prev, [id]: choice };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-grass-deep text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          🤔 Would You Rather?
        </h2>
        <p className="font-body text-ink/70 text-center mb-6 text-[0.95rem]">
          Pick a side. There are no wrong answers (mostly).
        </p>

        <div className="space-y-4 max-w-[700px] mx-auto">
          {QUESTIONS.map((q, i) => {
            const choice = votes[q.id];
            return (
              <div
                key={q.id}
                className="bg-white border-[3px] border-ink rounded-[20px] px-4 py-4"
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                }}
              >
                <p
                  className="font-display text-ink mb-3 text-center"
                  style={{ fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
                >
                  {q.q}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Side
                    onPick={() => vote(q.id, "a")}
                    selected={choice === "a"}
                    other={choice === "b"}
                    {...q.a}
                  />
                  <Side
                    onPick={() => vote(q.id, "b")}
                    selected={choice === "b"}
                    other={choice === "a"}
                    {...q.b}
                  />
                </div>
                {choice && (
                  <p className="font-body text-ink/70 text-center text-[0.9rem] mt-3">
                    Nice pick! Tap the other one to switch.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Side({
  emoji,
  label,
  color,
  selected,
  other,
  onPick,
}: {
  emoji: string;
  label: string;
  color: string;
  selected: boolean;
  other: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`${color} text-white border-[3px] border-ink rounded-[16px] px-3 py-4 flex flex-col items-center gap-2 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-opacity ${
        other ? "opacity-50" : ""
      } ${selected ? "ring-4 ring-sun" : ""}`}
      style={{ boxShadow: "var(--shadow-ink-sm)" }}
      aria-pressed={selected}
    >
      <span className="text-[2.4rem] leading-none" aria-hidden>
        {emoji}
      </span>
      <span
        className="font-display text-center leading-tight"
        style={{
          fontSize: "1rem",
          textShadow: "1.5px 1.5px 0 #2D3142",
        }}
      >
        {label}
      </span>
      {selected && <span className="text-sun font-display text-[1.1rem]">✓ PICKED</span>}
    </button>
  );
}
