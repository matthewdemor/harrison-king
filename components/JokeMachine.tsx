"use client";

import { useCallback, useState } from "react";

const JOKES: Array<{ q: string; a: string }> = [
  { q: "What do you call a sleeping bull-dog?", a: "A bull-DOZER! 🚜" },
  { q: "Why did the basketball player go to jail?", a: "Because he shot the ball! 🏀" },
  { q: "What kind of music do dogs love most?", a: "Anything with a strong BARK-beat! 🎶" },
  { q: "Why don't they play poker in the jungle?", a: "Too many cheetahs. 🐆" },
  { q: "What do you call a dog magician?", a: "A LAB-racadabrador! 🪄" },
  { q: "Why did the football coach yell at the vending machine?", a: "He wanted his quarter back! 🏈" },
  { q: "How do you catch a squirrel?", a: "Climb a tree and act like a nut! 🌰" },
  { q: "What do you call a baseball player who steals soap?", a: "A clean base-stealer! ⚾" },
  { q: "Why was the bike sad?", a: "Because it was two tired. 🚴" },
  { q: "What's a dog's favorite kind of pizza?", a: "PUP-eroni! 🍕" },
  { q: "What do you call a fish wearing a bowtie?", a: "Sofishticated. 🐟" },
  { q: "Why did the BYU Cougar bring a ladder to the game?", a: "To reach new heights! 💙" },
  { q: "Why did the swimmer bring string?", a: "To tie up loose ends! 🏊" },
  { q: "What's brown and sticky?", a: "A stick. 🪵" },
  { q: "Why don't dogs make good DJs?", a: "They keep ruff-ing the records. 🎧" },
  { q: "What did the beach say when the tide came in?", a: "Long time, no SEA! 🏖️" },
  { q: "How does a football player count to 10?", a: "1, 2, 3, 4, 5, 6, 7, 8, 9, TOUCHDOWN! 🙌" },
  { q: "What do you call a dog at the beach?", a: "A hot dog! 🌭" },
  { q: "Why did the cookie go to the doctor?", a: "It felt crummy. 🍪" },
  { q: "Knock, knock. Who's there? Cougar.", a: "Cougar who? Cou-GO Cougars! 🐯💙" },
];

export function JokeMachine() {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [used, setUsed] = useState(0);

  const next = useCallback(() => {
    let n = idx;
    while (n === idx && JOKES.length > 1) {
      n = Math.floor(Math.random() * JOKES.length);
    }
    setIdx(n);
    setShowAnswer(false);
    setUsed((u) => u + 1);
  }, [idx]);

  const joke = JOKES[idx]!;

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-red text-stroke-ink mb-4 text-center"
          style={{
            fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
            transform: "rotate(-1deg)",
          }}
        >
          😆 Joke Machine
        </h2>
        <p className="text-center font-body text-ink/70 mb-5 text-[0.95rem]">
          {used === 0 ? "Tap below to hear a joke!" : `${used} laughs and counting`}
        </p>

        <div
          className="bg-white border-[3px] border-ink rounded-[20px] px-6 py-6 mb-5 max-w-[600px] mx-auto"
          style={{ boxShadow: "var(--shadow-ink-sm)", transform: "rotate(-0.5deg)" }}
        >
          <p
            className="font-body text-ink mb-3 text-center"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)" }}
          >
            {joke.q}
          </p>
          {showAnswer ? (
            <p
              className="font-display text-red text-center"
              style={{
                fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
                textShadow: "2px 2px 0 #2D3142",
              }}
            >
              {joke.a}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="block mx-auto font-display bg-sun text-ink px-5 py-2 rounded-[14px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px]"
              style={{ boxShadow: "var(--shadow-ink-sm)" }}
            >
              Reveal! 👀
            </button>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={next}
            className="font-display bg-red text-white text-[1.2rem] px-7 py-3 rounded-[18px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px]"
            style={{ boxShadow: "var(--shadow-ink-sm)" }}
          >
            Another one! 🎲
          </button>
        </div>
      </div>
    </section>
  );
}
