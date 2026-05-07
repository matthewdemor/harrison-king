const STATS: Array<{ value: string; label: string; color: string }> = [
  { value: "6", label: "Years old", color: "bg-red" },
  { value: "∞", label: "Energy level", color: "bg-sun" },
  { value: "100%", label: "Cool factor", color: "bg-grass-deep" },
  { value: "Very", label: "Fast on bike", color: "bg-sky-deep" },
  { value: "1st", label: "To the deep end", color: "bg-byu-blue" },
  { value: "🐾", label: "Friends with all dogs", color: "bg-brown" },
];

export function HarryStats() {
  return (
    <section className="relative z-[2]">
      <div
        className="max-w-[900px] mx-5 my-10 sm:mx-auto px-2"
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`${s.color} text-white border-[3px] border-ink rounded-[20px] px-3 py-4 text-center`}
              style={{
                boxShadow: "var(--shadow-ink-sm)",
                transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)`,
              }}
            >
              <div
                className="font-display leading-none mb-1"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                  textShadow: "2px 2px 0 #2D3142",
                }}
              >
                {s.value}
              </div>
              <div className="font-body text-[0.95rem] leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
