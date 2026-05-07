const ITEMS: { emoji: string; name: string }[] = [
  { emoji: "🐶", name: "Dogs" },
  { emoji: "🏀", name: "Basketball" },
  { emoji: "🏈", name: "Football" },
  { emoji: "⚾", name: "Baseball" },
  { emoji: "🚴", name: "Bike Tricks" },
  { emoji: "🏖️", name: "The Beach" },
  { emoji: "🏊", name: "Swimming" },
  { emoji: "💙", name: "BYU" },
];

export function FavoriteThings() {
  return (
    <section className="relative z-[2]">
      <div
        className="tilt-right max-w-[900px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-grass-deep text-stroke-ink mb-5 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          Harry&apos;s Favorite Things
        </h2>
        <div className="grid gap-4 mt-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {ITEMS.map((item, i) => (
            <div
              key={item.name}
              className="bg-white border-[3px] border-ink rounded-[20px] py-5 px-3 text-center transition-transform"
              style={{
                boxShadow: "var(--shadow-ink-sm)",
                transform: i % 2 === 0 ? "rotate(-2deg)" : "rotate(2deg)",
              }}
            >
              <span
                className="text-[3rem] block mb-2"
                style={{
                  animation: "var(--animate-jiggle)",
                  animationDelay: `${(i % 4) * 0.3}s`,
                }}
              >
                {item.emoji}
              </span>
              <div className="font-body font-bold text-[1.2rem] text-ink">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
