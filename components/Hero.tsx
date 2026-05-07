export function Hero() {
  return (
    <header className="relative text-center px-5 pt-[120px] pb-[60px] z-[2] sm:pt-20 sm:pb-10">
      <div
        className="w-[200px] h-[200px] mx-auto relative"
        style={{ animation: "var(--animate-dog-bounce)" }}
      >
        <DogMascotSVG />
      </div>

      <h1
        className="font-display text-red leading-[0.95] mb-[10px] mt-5"
        style={{
          fontSize: "clamp(3rem, 12vw, 6rem)",
          textShadow: "4px 4px 0 #2D3142, 8px 8px 0 rgba(0,0,0,0.15)",
          letterSpacing: "2px",
          transform: "rotate(-2deg)",
        }}
      >
        HARRISON{" "}
        <span
          className="inline-block text-sun text-stroke-ink-3"
          style={{ animation: "var(--animate-wiggle)" }}
        >
          KING
        </span>
      </h1>

      <div
        className="inline-block bg-cream text-ink mt-4 mb-2 px-6 py-2 rounded-[30px] border-[3px] border-ink"
        style={{
          fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
          transform: "rotate(1.5deg)",
          boxShadow: "var(--shadow-ink-sm)",
        }}
      >
        Probably the coolest 6-year-old you&apos;ll ever meet 🐾
      </div>
      <br />
      <div
        className="inline-block bg-red text-white font-display text-[2rem] w-20 h-20 leading-[80px] rounded-full border-[4px] border-ink mt-5"
        style={{
          transform: "rotate(-8deg)",
          boxShadow: "var(--shadow-ink-sm)",
          animation: "var(--animate-bounce-tilt)",
        }}
      >
        6
      </div>
    </header>
  );
}

function DogMascotSVG() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" aria-label="Harry's dog mascot">
      <ellipse cx="100" cy="135" rx="55" ry="40" fill="#D4A574" stroke="#2D3142" strokeWidth="4" />
      <circle cx="100" cy="85" r="48" fill="#D4A574" stroke="#2D3142" strokeWidth="4" />
      <ellipse cx="65" cy="55" rx="14" ry="22" fill="#8B5A3C" stroke="#2D3142" strokeWidth="4" transform="rotate(-25 65 55)" />
      <ellipse cx="135" cy="55" rx="14" ry="22" fill="#8B5A3C" stroke="#2D3142" strokeWidth="4" transform="rotate(25 135 55)" />
      <ellipse cx="100" cy="48" rx="38" ry="6" fill="#C73E3E" stroke="#2D3142" strokeWidth="3" />
      <path d="M 75 48 Q 100 10, 125 48" fill="#E94B4B" stroke="#2D3142" strokeWidth="3" />
      <circle cx="100" cy="22" r="6" fill="#FFE066" stroke="#2D3142" strokeWidth="2" />
      <circle cx="85" cy="85" r="6" fill="#2D3142" />
      <circle cx="115" cy="85" r="6" fill="#2D3142" />
      <circle cx="87" cy="83" r="2" fill="white" />
      <circle cx="117" cy="83" r="2" fill="white" />
      <ellipse cx="100" cy="105" rx="18" ry="13" fill="#F5DEB3" stroke="#2D3142" strokeWidth="3" />
      <ellipse cx="100" cy="98" rx="6" ry="4" fill="#2D3142" />
      <path d="M 100 105 Q 100 115 92 115" fill="none" stroke="#2D3142" strokeWidth="3" strokeLinecap="round" />
      <path d="M 100 105 Q 100 115 108 115" fill="none" stroke="#2D3142" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="100" cy="118" rx="5" ry="4" fill="#FF6B9D" stroke="#2D3142" strokeWidth="2" />
      <rect x="72" y="160" width="16" height="20" rx="6" fill="#D4A574" stroke="#2D3142" strokeWidth="3" />
      <rect x="112" y="160" width="16" height="20" rx="6" fill="#D4A574" stroke="#2D3142" strokeWidth="3" />
    </svg>
  );
}
