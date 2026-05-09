"use client";

import { useEffect, useRef } from "react";
import { speak } from "@/lib/audio/speak";

type Props = {
  word: string;
  /** When true, this is a quick label-tap card that auto-dismisses; otherwise it's a Heart Word collection card with explicit GOT IT. */
  autoDismiss?: boolean;
  speechEnabled: boolean;
  onClose: () => void;
};

export function HeartWordCard({ word, autoDismiss = false, speechEnabled, onClose }: Props) {
  const spokenRef = useRef(false);

  useEffect(() => {
    if (!spokenRef.current) {
      spokenRef.current = true;
      speak(word, { enabled: speechEnabled });
    }
  }, [word, speechEnabled]);

  useEffect(() => {
    if (!autoDismiss) return;
    const t = setTimeout(onClose, 1500);
    return () => clearTimeout(t);
  }, [autoDismiss, onClose]);

  const sayAgain = () => {
    speak(word, { enabled: speechEnabled });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Heart word: ${word}`}
      className="absolute inset-0 z-30 flex items-center justify-center p-4"
      style={{ background: "rgba(45, 49, 66, 0.55)" }}
      onClick={autoDismiss ? onClose : undefined}
    >
      <div
        className="bg-cream border-[5px] border-ink rounded-[28px] px-8 py-10 text-center max-w-[640px] w-full"
        style={{
          boxShadow: "10px 10px 0 #2D3142",
          transform: "rotate(-1deg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-body text-ink/70 text-[1rem] mb-2">
          {autoDismiss ? "this is…" : "you found a heart word!"}
        </p>
        <div
          className="font-display text-red leading-none mb-6"
          style={{
            fontSize: "clamp(4.5rem, 22vw, 8rem)",
            textShadow: "5px 5px 0 #2D3142",
          }}
        >
          {word}
        </div>
        {!autoDismiss && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={sayAgain}
              className="font-display bg-sky-deep text-white px-6 py-3 rounded-[18px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px] min-h-[60px]"
              style={{ boxShadow: "var(--shadow-ink-sm)", fontSize: "1.2rem" }}
            >
              🔁 HEAR IT AGAIN
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-display bg-grass-deep text-white px-6 py-3 rounded-[18px] border-[3px] border-ink active:translate-x-[2px] active:translate-y-[2px] min-h-[60px]"
              style={{ boxShadow: "var(--shadow-ink-sm)", fontSize: "1.2rem" }}
            >
              ✅ GOT IT!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
