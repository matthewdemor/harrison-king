import Link from "next/link";

export function PlayCTA() {
  return (
    <section className="relative z-[2]">
      <div
        className="max-w-[900px] mx-5 my-10 sm:mx-auto bg-ink border-[5px] border-ink rounded-[28px] px-7 py-8 text-center"
        style={{ boxShadow: "var(--shadow-ink-lg)", transform: "rotate(-0.5deg)" }}
      >
        <div
          className="font-display text-sun leading-none mb-3 text-stroke-ink"
          style={{
            fontSize: "clamp(2rem, 8vw, 3.6rem)",
            textShadow: "5px 5px 0 #E94B4B",
            transform: "rotate(-1deg)",
          }}
        >
          🎮 PLAY THE GAME!
        </div>
        <p className="font-body text-cream text-[1.1rem] mb-6 max-w-[600px] mx-auto">
          Save the dogs from the evil horned cat! Throw your hat, grab flags, and beat the boss
          in <strong className="text-sun">Super Dog World</strong>.
        </p>
        <Link
          href="/play"
          prefetch
          className="inline-block font-display bg-red text-white text-[1.6rem] px-8 py-4 rounded-[20px] border-[4px] border-cream active:translate-x-[3px] active:translate-y-[3px]"
          style={{
            boxShadow: "6px 6px 0 #FFE066",
            transform: "rotate(2deg)",
          }}
        >
          START PLAYING ▶
        </Link>
        <p className="font-body text-cream/70 text-[0.85rem] mt-5">
          Top score: <strong className="text-sun">3,500</strong> · Played 100% by Harry, probably 🐾
        </p>
      </div>
    </section>
  );
}
