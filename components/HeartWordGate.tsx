"use client";

import { useEffect, useState } from "react";
import { HEART_WORDS } from "@/lib/words/heart-words";
import { speak } from "@/lib/audio/speak";

type Props = {
  collected: Record<string, boolean>;
  speechEnabled: boolean;
  onClose: () => void;
  onOpenGate: () => void;
};

export function HeartWordGate({ collected, speechEnabled, onClose, onOpenGate }: Props) {
  const allFound = HEART_WORDS.every((w) => collected[w]);
  const [tapped, setTapped] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (allFound) {
      speak("you found all the heart words! tap each one to read it to me.", {
        enabled: speechEnabled,
      });
    } else {
      const missing = HEART_WORDS.filter((w) => !collected[w]).length;
      speak(`almost there! you are missing ${missing} heart words.`, {
        enabled: speechEnabled,
      });
    }
    // intentionally only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tapWord = (w: string) => {
    speak(w, { enabled: speechEnabled });
    setTapped((prev) => ({ ...prev, [w]: true }));
  };

  const allTapped = HEART_WORDS.every((w) => tapped[w]);

  useEffect(() => {
    if (allFound && allTapped) {
      speak("you opened the gate! go beat the cat!", { enabled: speechEnabled });
      const t = setTimeout(() => {
        onOpenGate();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [allFound, allTapped, onOpenGate, speechEnabled]);

  const missingZones = HEART_WORDS.filter((w) => !collected[w]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Wise Owl"
      className="absolute inset-0 z-30 flex items-center justify-center p-3 overflow-y-auto"
      style={{ background: "rgba(45, 49, 66, 0.78)" }}
    >
      <div
        className="bg-cream border-[5px] border-ink rounded-[28px] px-5 py-6 sm:px-8 sm:py-8 max-w-[680px] w-full my-4"
        style={{
          boxShadow: "10px 10px 0 #2D3142",
          transform: "rotate(-0.5deg)",
        }}
      >
        <div className="text-center mb-3">
          <span className="text-[3.5rem] inline-block" aria-hidden>
            🦉
          </span>
          <p
            className="font-display text-red leading-none mt-1 text-stroke-ink"
            style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", textShadow: "3px 3px 0 #2D3142" }}
          >
            The Wise Owl
          </p>
        </div>

        {allFound ? (
          <>
            <p
              className="font-body text-ink text-center mb-4"
              style={{ fontSize: "clamp(1rem, 3vw, 1.15rem)" }}
            >
              You found all 20 heart words! Tap each one to read it to me, and I&apos;ll open the gate to the boss!
            </p>
            <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-4">
              {HEART_WORDS.map((w, i) => {
                const isTapped = !!tapped[w];
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => tapWord(w)}
                    className={`relative font-display border-[3px] border-ink rounded-[14px] py-3 px-2 min-h-[60px] flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px] ${
                      isTapped ? "bg-grass" : "bg-white"
                    }`}
                    style={{
                      boxShadow: "var(--shadow-ink-sm)",
                      transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                      fontSize: "clamp(0.95rem, 2.5vw, 1.25rem)",
                      color: "#2D3142",
                    }}
                    aria-label={`Read the word ${w}`}
                  >
                    {w}
                    {isTapped && (
                      <span
                        className="absolute -top-2 -right-2 bg-sun text-ink rounded-full w-6 h-6 flex items-center justify-center border-2 border-ink"
                        aria-hidden
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="font-body text-ink/70 text-center text-[0.95rem] mb-4">
              {Object.values(tapped).filter(Boolean).length}/{HEART_WORDS.length} read
              {allTapped ? " — opening the gate!" : ""}
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="font-display bg-cream text-ink px-5 py-2 rounded-[14px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px]"
                style={{ boxShadow: "var(--shadow-ink-sm)" }}
              >
                Be right back
              </button>
            </div>
          </>
        ) : (
          <>
            <p
              className="font-body text-ink text-center mb-3"
              style={{ fontSize: "clamp(1rem, 3vw, 1.15rem)" }}
            >
              Almost there! You&apos;re missing <strong>{missingZones.length}</strong> heart word
              {missingZones.length === 1 ? "" : "s"}. Go find {missingZones.length === 1 ? "it" : "them"} and come back!
            </p>
            <div className="bg-white border-[3px] border-ink rounded-[14px] px-3 py-3 mb-4 max-h-[180px] overflow-y-auto">
              <p className="font-body text-ink/70 text-[0.85rem] mb-2 text-center">
                still hidden:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {missingZones.map((w) => (
                  <span
                    key={w}
                    className="font-display bg-cream border-2 border-ink rounded-[10px] px-3 py-1 text-[0.95rem]"
                    style={{ color: "#2D3142" }}
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
            <p className="font-body text-ink/70 text-center text-[0.9rem] mb-4">
              hint: try every platform, every dog mountain, and the high ledges 🚀
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="font-display bg-red text-white px-6 py-3 rounded-[16px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px]"
                style={{ boxShadow: "var(--shadow-ink-sm)", fontSize: "1.1rem" }}
              >
                Keep exploring →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
