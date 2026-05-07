"use client";

import { useState } from "react";

type SportFact = { emoji: string; sport: string; color: string; facts: string[] };

const SPORTS: SportFact[] = [
  {
    emoji: "🏀",
    sport: "Basketball",
    color: "bg-red",
    facts: [
      "The first basketball hoops were peach baskets — someone had to climb up to get the ball after every score!",
      "An NBA basketball weighs about 22 ounces. Hold a 1-pound bag of sugar — that's about right.",
      "The shortest NBA player ever was Muggsy Bogues at just 5 feet 3 inches tall.",
      "A regulation hoop is exactly 10 feet off the ground. Don't even try.",
      "Michael Jordan was once cut from his high school basketball team. Look how that turned out.",
      "The longest NBA winning streak is 33 games — the 1971-72 LA Lakers.",
    ],
  },
  {
    emoji: "🏈",
    sport: "Football",
    color: "bg-brown",
    facts: [
      "A football isn't actually round — it's called a prolate spheroid. Try saying that fast.",
      "The Super Bowl trophy is named after coach Vince Lombardi.",
      "A regulation NFL game is 60 minutes long, but the average game lasts 3 hours and 12 minutes.",
      "The Green Bay Packers are the only NFL team owned by their fans.",
      "Footballs used to be made of pig bladders. Hence the nickname \"pigskin.\"",
      "BYU won the 1984 NCAA football national championship — Go Cougars!",
    ],
  },
  {
    emoji: "⚾",
    sport: "Baseball",
    color: "bg-sky-deep",
    facts: [
      "A baseball has exactly 108 stitches, sewn by hand.",
      "The fastest pitch ever recorded was 105.8 mph by Aroldis Chapman in 2010.",
      "Baseball was invented in the 1840s — older than the modern Olympics!",
      "A perfect game is when a pitcher faces 27 batters and not one reaches base. It's only happened 24 times in MLB history.",
      "The longest baseball game ever was 33 innings between two minor-league teams in 1981.",
      "A new baseball is used about every 6 pitches in MLB games.",
    ],
  },
];

export function SportsCards() {
  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-sky-deep text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          🏆 Sports Stuff
        </h2>
        <p className="font-body text-ink/70 text-center mb-6 text-[0.95rem]">
          Tap any card for a new fact!
        </p>
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-3">
          {SPORTS.map((s, i) => (
            <SportCard key={s.sport} sport={s} tilt={i % 2 === 0 ? -1 : 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SportCard({ sport, tilt }: { sport: SportFact; tilt: number }) {
  const [factIdx, setFactIdx] = useState(0);
  const [taps, setTaps] = useState(0);
  const cycle = () => {
    setFactIdx((i) => (i + 1) % sport.facts.length);
    setTaps((t) => t + 1);
  };
  return (
    <button
      type="button"
      onClick={cycle}
      className={`text-left ${sport.color} text-white border-[3px] border-ink rounded-[20px] px-5 py-5 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] flex flex-col gap-3`}
      style={{
        boxShadow: "var(--shadow-ink-sm)",
        transform: `rotate(${tilt}deg)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[3rem] leading-none">{sport.emoji}</span>
        <span className="font-body text-[0.8rem] bg-white/20 rounded-full px-2 py-1">
          tap {taps}
        </span>
      </div>
      <div
        className="font-display leading-none"
        style={{
          fontSize: "clamp(1.4rem, 3.5vw, 1.8rem)",
          textShadow: "2px 2px 0 #2D3142",
        }}
      >
        {sport.sport}
      </div>
      <p className="font-body text-[0.95rem] leading-snug">
        {sport.facts[factIdx]}
      </p>
    </button>
  );
}
