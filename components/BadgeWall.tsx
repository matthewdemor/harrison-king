"use client";

import { useState } from "react";

type Badge = {
  emoji: string;
  name: string;
  color: string;
  desc: string;
};

const BADGES: Badge[] = [
  { emoji: "🚴", name: "Wheelie King", color: "bg-red", desc: "Holds a wheelie longer than the wind can keep up." },
  { emoji: "🏊", name: "Swim Champ", color: "bg-sky-deep", desc: "Will absolutely smoke you to the deep end. Bring goggles." },
  { emoji: "🐶", name: "Top Dog", color: "bg-brown", desc: "Best friend to every dog he meets. They sense the energy." },
  { emoji: "🏀", name: "Hoop Hero", color: "bg-red-deep", desc: "Knows the rim by name. Backboard? Optional." },
  { emoji: "🏈", name: "Touchdown Tornado", color: "bg-grass-deep", desc: "Spirals tight, runs fast, never quits." },
  { emoji: "⚾", name: "Slugger", color: "bg-sky", desc: "Hits the ball hard enough that the dog watches it go." },
  { emoji: "💙", name: "Cougar Loyalty", color: "bg-byu-blue", desc: "Wears blue every Saturday. Has opinions about Boise State." },
  { emoji: "🌊", name: "Wave Rider", color: "bg-sky-deep", desc: "Catches waves on body, board, or pure attitude." },
  { emoji: "🎩", name: "Hat Trick Hero", color: "bg-red", desc: "If you've played Super Dog World, you know exactly why." },
  { emoji: "🦴", name: "Dog Whisperer", color: "bg-grass", desc: "Speaks fluent woof. Some say he's part golden retriever." },
  { emoji: "⚡", name: "Speed Demon", color: "bg-sun", desc: "Goes so fast on his bike, photos come out blurry." },
  { emoji: "👑", name: "King Energy", color: "bg-red-deep", desc: "Last name checks out. Coolest 6-year-old confirmed." },
];

export function BadgeWall() {
  const [active, setActive] = useState<number | null>(null);

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
          🏅 Harry&apos;s Badge Wall
        </h2>
        <p className="font-body text-ink/70 text-center mb-6 text-[0.95rem]">
          Tap a badge to learn what Harry earned it for
        </p>
        <div
          className="grid gap-4 max-w-[760px] mx-auto"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))" }}
        >
          {BADGES.map((b, i) => {
            const isActive = active === i;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => setActive(isActive ? null : i)}
                className={`relative ${b.color} text-white border-[3px] border-ink rounded-[18px] px-3 py-4 flex flex-col items-center gap-2 cursor-pointer active:translate-x-[2px] active:translate-y-[2px]`}
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                }}
                aria-pressed={isActive}
              >
                <span className="text-[2.5rem] leading-none" aria-hidden>
                  {b.emoji}
                </span>
                <span
                  className="font-display text-center leading-tight"
                  style={{ fontSize: "0.95rem", textShadow: "1.5px 1.5px 0 #2D3142" }}
                >
                  {b.name}
                </span>
              </button>
            );
          })}
        </div>

        {active !== null && (
          <div
            role="status"
            className="max-w-[640px] mx-auto mt-6 bg-white border-[3px] border-ink rounded-[20px] px-5 py-4"
            style={{ boxShadow: "var(--shadow-ink-sm)", transform: "rotate(-0.5deg)" }}
          >
            <p
              className="font-display text-red leading-none mb-2"
              style={{ fontSize: "1.4rem" }}
            >
              {BADGES[active]!.emoji} {BADGES[active]!.name}
            </p>
            <p className="font-body text-ink text-[1rem]">{BADGES[active]!.desc}</p>
          </div>
        )}
      </div>
    </section>
  );
}
