"use client";

import { useState } from "react";

type Item = { emoji: string; name: string; fact: string };

const ITEMS: Item[] = [
  { emoji: "🐶", name: "Dogs", fact: "Especially golden retrievers. Will pet every dog he meets." },
  { emoji: "🏀", name: "Basketball", fact: "Can dribble between his legs (sometimes on purpose)." },
  { emoji: "🏈", name: "Football", fact: "Throws a perfect spiral. Wants the ball every play." },
  { emoji: "⚾", name: "Baseball", fact: "Can hit AND pitch. Glove always nearby." },
  { emoji: "🚴", name: "Bike Tricks", fact: "Goes faster than the wind. Can bunny hop a curb." },
  { emoji: "🏖️", name: "The Beach", fact: "Sandcastles, body-surfing, hunting for cool shells." },
  { emoji: "🏊", name: "Swimming", fact: "Will race anyone to the deep end and win." },
  { emoji: "💙", name: "BYU", fact: "Royal blue all the way. Cosmo the Cougar is a personal hero." },
  { emoji: "🎮", name: "Video Games", fact: "Especially platformers — see Super Dog World above!" },
  { emoji: "🍕", name: "Pizza", fact: "Pepperoni only. Crust is for losers (his words)." },
  { emoji: "🎂", name: "Birthdays", fact: "His favorite holiday. Currently 6 — see giant red 6 above." },
  { emoji: "🎢", name: "Roller Coasters", fact: "Hands UP, eyes OPEN. The bigger the drop, the better." },
];

export function FavoriteThings() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setFlipped((p) => ({ ...p, [i]: !p[i] }));

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-grass-deep text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          Harry&apos;s Favorite Things
        </h2>
        <p className="font-body text-ink/70 text-center mb-6 text-[0.95rem]">
          Tap any card for the inside scoop
        </p>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {ITEMS.map((item, i) => {
            const isFlipped = !!flipped[i];
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => toggle(i)}
                className={`relative ${isFlipped ? "bg-sun" : "bg-white"} border-[3px] border-ink rounded-[20px] py-5 px-3 text-center cursor-pointer min-h-[160px] flex flex-col justify-center active:translate-x-[2px] active:translate-y-[2px] transition-transform`}
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
                }}
                aria-pressed={isFlipped}
                aria-label={`${item.name}${isFlipped ? " (showing fact)" : ""}`}
              >
                {isFlipped ? (
                  <p className="font-body text-ink text-[0.95rem] leading-snug">
                    {item.fact}
                  </p>
                ) : (
                  <>
                    <span
                      className="text-[3rem] block mb-2"
                      style={{
                        animation: "var(--animate-jiggle)",
                        animationDelay: `${(i % 4) * 0.3}s`,
                      }}
                      aria-hidden
                    >
                      {item.emoji}
                    </span>
                    <span className="font-body font-bold text-[1.15rem] text-ink">
                      {item.name}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
