"use client";

import { useState } from "react";

const ITEMS: Array<{ title: string; emoji: string; body: string }> = [
  {
    emoji: "🐯",
    title: "The Mascot",
    body:
      "BYU's mascot is Cosmo the Cougar, who has been bouncing around football games and pep rallies since 1953. Cosmo dunks from trampolines and once rode a Harley-Davidson onto the field.",
  },
  {
    emoji: "💙",
    title: "School Colors",
    body:
      "Royal blue and white. Ask any Cougar fan and you'll hear it loud: the blue is so good it should be in the crayon box.",
  },
  {
    emoji: "🏆",
    title: "Football Glory",
    body:
      "BYU won a national championship in 1984. Quarterback Steve Young (yes, that Steve Young) played there and went on to win 3 Super Bowls.",
  },
  {
    emoji: "🏀",
    title: "Basketball Star",
    body:
      "Jimmer Fredette was the most exciting college basketball player of 2011. He hit shots from the parking lot. Defenders had no idea what to do.",
  },
  {
    emoji: "🏟️",
    title: "LaVell Edwards Stadium",
    body:
      "63,000 seats. Named after Coach LaVell Edwards, who coached BYU football for 29 years and won 257 games. That is a LOT of touchdowns.",
  },
  {
    emoji: "🌄",
    title: "The View",
    body:
      "BYU sits at the foot of the Wasatch Mountains. The football stadium has snow-capped peaks behind the goalposts. It looks like a postcard.",
  },
  {
    emoji: "🪙",
    title: "The Big 12",
    body:
      "Starting in 2023, BYU joined the Big 12 — one of college sports' biggest conferences. New rivals, new road trips, same blue.",
  },
];

export function BYUAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display mb-2 text-center text-stroke-ink"
          style={{
            color: "#002E5D",
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          💙 All About BYU
        </h2>
        <p className="font-body text-ink/70 text-center mb-5 text-[0.95rem]">
          Tap any card to open it
        </p>

        <div className="space-y-3 max-w-[640px] mx-auto">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left bg-white border-[3px] border-ink rounded-[18px] px-5 py-4 active:translate-x-[2px] active:translate-y-[2px]"
                style={{
                  boxShadow: "var(--shadow-ink-sm)",
                  transform: i % 2 === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                }}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[1.8rem]">{item.emoji}</span>
                  <span
                    className="font-display flex-1"
                    style={{
                      color: "#002E5D",
                      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                    }}
                  >
                    {item.title}
                  </span>
                  <span className="font-display text-ink text-[1.4rem]">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
                {isOpen && (
                  <p className="font-body text-ink mt-3 leading-snug">{item.body}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
