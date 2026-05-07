"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  tape: "yellow" | "red" | "blue";
  tilt: number;
  width: number;
  height: number;
};

const PHOTOS: Photo[] = [
  {
    src: "/photos/harry-1-baby.jpg",
    alt: "Tiny Harry being held — pre-school days",
    caption: "Baby Harry — already plotting world domination",
    tape: "yellow",
    tilt: -3,
    width: 1200,
    height: 1600,
  },
  {
    src: "/photos/harry-2-shoulders.jpg",
    alt: "Harry on shoulders in a tropical garden",
    caption: "King of the jungle 🌴",
    tape: "blue",
    tilt: 2,
    width: 1400,
    height: 1869,
  },
  {
    src: "/photos/harry-3-tron.jpg",
    alt: "Harry on the TRON Lightcycle ride at Disney",
    caption: "Lightcycle pilot, full send 🏍️",
    tape: "red",
    tilt: -2,
    width: 1400,
    height: 1869,
  },
  {
    src: "/photos/harry-4-buzz.jpg",
    alt: "Harry on the Buzz Lightyear ride at Disney",
    caption: "Defeating Zurg, obviously 🚀",
    tape: "yellow",
    tilt: 3,
    width: 1400,
    height: 1869,
  },
  {
    src: "/photos/harry-5-bronco.jpg",
    alt: "Family in winter gear in front of red Bronco in the snow",
    caption: "Snow squad, red Bronco vibes ❄️",
    tape: "blue",
    tilt: -2,
    width: 1600,
    height: 2133,
  },
  {
    src: "/photos/harry-6-sled.jpg",
    alt: "Family group photo with festive sleigh bells",
    caption: "Sleigh-bell season 🛷🔔",
    tape: "red",
    tilt: 2,
    width: 1600,
    height: 1200,
  },
];

const tapeColor = {
  yellow: "#FFE066",
  red: "#E94B4B",
  blue: "#5BA8D0",
} as const;

export function PhotoGallery() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % PHOTOS.length)),
    [],
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, close, next, prev]);

  return (
    <section className="relative z-[2]">
      <div
        className="tilt-left max-w-[1000px] mx-5 my-10 sm:mx-auto bg-cream border-[4px] border-ink rounded-[30px] px-7 py-8"
        style={{ boxShadow: "var(--shadow-ink)" }}
      >
        <h2
          className="font-display text-red text-stroke-ink mb-2 text-center"
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            transform: "rotate(-1deg)",
          }}
        >
          📸 Photos of Harry
        </h2>
        <p className="font-body text-ink/70 text-center mb-8 text-[0.95rem]">
          Tap a polaroid to make it bigger
        </p>

        <div
          className="grid gap-x-6 gap-y-12"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="relative block bg-white border-[3px] border-ink rounded-[10px] p-3 pb-12 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] transition-transform"
              style={{
                boxShadow: "var(--shadow-ink-sm)",
                transform: `rotate(${p.tilt}deg)`,
              }}
              aria-label={`View ${p.caption}`}
            >
              <span
                aria-hidden
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-[2px] opacity-90 border border-ink/20"
                style={{
                  background: tapeColor[p.tape],
                  transform: "translateX(-50%) rotate(-3deg)",
                  boxShadow: "1px 1px 0 rgba(0,0,0,0.15)",
                }}
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-ink/5 border-2 border-ink/15">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={i < 2}
                />
              </div>
              <p
                className="font-hand text-ink text-center mt-3 text-[1.05rem] leading-tight"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                {p.caption}
              </p>
            </button>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <Lightbox
          photo={PHOTOS[openIdx]!}
          index={openIdx}
          total={PHOTOS.length}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </section>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onNext,
  onPrev,
}: {
  photo: Photo;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-ink/95 flex flex-col items-center justify-center p-4"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-[101] font-display bg-cream text-ink w-12 h-12 rounded-full border-[3px] border-ink text-[1.4rem] active:translate-x-[2px] active:translate-y-[2px]"
        style={{ boxShadow: "var(--shadow-ink-sm)" }}
        aria-label="Close"
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[min(900px,95vw)] max-h-[80vh] w-full flex flex-col items-center"
      >
        <div className="bg-white border-[3px] border-ink rounded-[12px] p-3 pb-4 w-full">
          <div className="relative w-full" style={{ aspectRatio: `${photo.width} / ${photo.height}`, maxHeight: "70vh" }}>
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 95vw, 900px"
              className="object-contain rounded-[6px]"
              priority
            />
          </div>
          <p
            className="font-hand text-ink text-center mt-3 text-[1.2rem]"
            style={{ fontFamily: "var(--font-hand)" }}
          >
            {photo.caption}
          </p>
        </div>
        <p className="font-body text-cream/80 mt-3 text-[0.95rem]">
          {index + 1} / {total}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 font-display bg-cream text-ink w-12 h-12 rounded-full border-[3px] border-ink text-[1.4rem] active:translate-x-[2px] active:translate-y-[2px]"
        style={{ boxShadow: "var(--shadow-ink-sm)" }}
      >
        ◀
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 font-display bg-cream text-ink w-12 h-12 rounded-full border-[3px] border-ink text-[1.4rem] active:translate-x-[2px] active:translate-y-[2px]"
        style={{ boxShadow: "var(--shadow-ink-sm)" }}
      >
        ▶
      </button>
    </div>
  );
}
