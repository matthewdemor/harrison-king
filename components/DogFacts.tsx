"use client";

import { useCallback, useState } from "react";

const DOG_FACTS: string[] = [
  "Dogs have about 1,700 taste buds. People have ~9,000 — but dogs use their nose to taste, too!",
  "A dog's nose print is unique, just like your fingerprint. Detective dog! 🕵️",
  "The world's fastest dog, the Greyhound, can run up to 45 mph — faster than most cars in a parking lot.",
  "Dalmatians are born totally white. The spots show up after a few weeks!",
  "Dogs sweat through their paw pads, not their skin. That's why they pant.",
  "Three dogs survived the Titanic in 1912 — two Pomeranians and one Pekingese.",
  "A dog's sense of smell is between 10,000 and 100,000 times stronger than a human's.",
  "Dogs dream just like people do — they twitch and woof in their sleep!",
  "A Bloodhound's nose is so good its work is allowed as evidence in court.",
  "Puppies are born blind, deaf, and toothless. They open their eyes after about 2 weeks.",
  "The Basenji is the only dog that can't bark — it yodels instead. 🎵",
  "Dogs only have sweat glands in two places: between their paw pads and in their ear canals.",
  "A dog's wagging tail can mean lots of things — a slow wag isn't always happy!",
  "The longest-lived dog ever, Bobi, lived to 31 years old in Portugal.",
  "Some dogs can learn over 1,000 words. A border collie named Chaser learned 1,022.",
  "Dogs curl up in a ball when they sleep to protect their bellies from threats — left over from wolf days.",
  "Yawning is contagious from people to dogs. Try it — your dog might yawn back!",
  "A Newfoundland dog has webbed feet and is one of the best swimming dogs in the world.",
  "Dogs can be trained to sniff out cancer, low blood sugar, and even seizures before they happen.",
  "Saint Bernards used to wear barrels in old paintings, but in real life, they never actually did.",
  "Dogs see in shades of yellow and blue, not full color like people. Their world looks like a calm sunset.",
  "Chihuahuas are the smallest dog breed in the world. The biggest are Great Danes — almost 7 ft on hind legs!",
];

export function DogFacts() {
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState(1);

  const nextFact = useCallback(() => {
    let n = idx;
    while (n === idx && DOG_FACTS.length > 1) {
      n = Math.floor(Math.random() * DOG_FACTS.length);
    }
    setIdx(n);
    setSeen((s) => Math.min(s + 1, DOG_FACTS.length));
  }, [idx]);

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
          🐶 Wild Dog Facts
        </h2>
        <p className="font-body text-ink/70 text-center mb-5 text-[0.95rem]">
          You&apos;ve unlocked {seen} of {DOG_FACTS.length} facts
        </p>

        <div
          className="bg-white border-[3px] border-ink rounded-[20px] px-6 py-6 mb-5 max-w-[640px] mx-auto"
          style={{
            boxShadow: "var(--shadow-ink-sm)",
            transform: "rotate(0.5deg)",
          }}
        >
          <p
            className="font-body text-ink text-center leading-snug"
            style={{ fontSize: "clamp(1.05rem, 2.8vw, 1.25rem)" }}
          >
            {DOG_FACTS[idx]}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={nextFact}
            className="font-display bg-grass-deep text-white text-[1.2rem] px-7 py-3 rounded-[18px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px]"
            style={{ boxShadow: "var(--shadow-ink-sm)" }}
          >
            Tell me another! 🦴
          </button>
        </div>
      </div>
    </section>
  );
}
