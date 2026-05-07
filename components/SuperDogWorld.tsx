"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { H, W } from "@/lib/game/constants";
import { createInitialState } from "@/lib/game/state";
import { render } from "@/lib/game/render";
import { throwHat as engineThrowHat, tryJump as engineTryJump, update as engineUpdate } from "@/lib/game/engine";
import type { GameState, Keys } from "@/lib/game/types";

type Phase = "title" | "playing" | "win" | "lose" | "submitted";

export function SuperDogWorld() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const keysRef = useRef<Keys>({});
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("title");

  const [phase, setPhase] = useState<Phase>("title");
  const [, forceTick] = useState(0);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setPhaseSync = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    setSubmitError(null);
    stateRef.current = createInitialState();
    setPhaseSync("playing");
    lastTimeRef.current = performance.now();

    const loop = (t: number) => {
      const dt = t - lastTimeRef.current;
      lastTimeRef.current = t;
      const state = stateRef.current;
      engineUpdate(state, dt, keysRef.current, {
        onWin: () => {
          if (phaseRef.current === "playing") {
            setTimeout(() => setPhaseSync("win"), 1200);
            phaseRef.current = "win";
          }
        },
        onLose: () => {
          if (phaseRef.current === "playing") {
            setTimeout(() => setPhaseSync("lose"), 600);
            phaseRef.current = "lose";
          }
        },
      });
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) render(ctx, state);
      }
      forceTick((n) => (n + 1) % 1_000_000);
      if (phaseRef.current === "playing") {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    stopLoop();
    rafRef.current = requestAnimationFrame(loop);
  }, [setPhaseSync, stopLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    render(ctx, stateRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (phaseRef.current !== "playing") return;
      if (e.code === "KeyF" || e.code === "KeyX") engineThrowHat(stateRef.current);
      if (e.code === "Space" || e.code === "ArrowUp") engineTryJump(stateRef.current);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => () => stopLoop(), [stopLoop]);

  const submitScore = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);
    const state = stateRef.current;
    const cleanName = name.trim() || "Anonymous";
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_name: cleanName,
          score: state.score,
          flags_collected: state.flagsGot,
          defeated_boss: state.boss.defeated,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data?.error ?? "Could not submit score. Try again!");
      } else {
        window.dispatchEvent(new CustomEvent("leaderboard:refresh"));
        setPhaseSync("submitted");
      }
    } catch {
      setSubmitError("Network hiccup. Try again!");
    } finally {
      setSubmitting(false);
    }
  }, [name, setPhaseSync]);

  const bindMobileKey = (key: string) => ({
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      keysRef.current[key] = true;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      keysRef.current[key] = false;
    },
    onTouchCancel: (e: React.TouchEvent) => {
      e.preventDefault();
      keysRef.current[key] = false;
    },
    onMouseDown: () => {
      keysRef.current[key] = true;
    },
    onMouseUp: () => {
      keysRef.current[key] = false;
    },
    onMouseLeave: () => {
      keysRef.current[key] = false;
    },
  });

  const onJumpButton = (e: React.SyntheticEvent) => {
    e.preventDefault();
    engineTryJump(stateRef.current);
  };
  const onHatButton = (e: React.SyntheticEvent) => {
    e.preventDefault();
    engineThrowHat(stateRef.current);
  };

  const state = stateRef.current;

  return (
    <section className="px-4 py-10 sm:py-20 sm:px-2">
      <div
        className="game-card max-w-[900px] mx-auto bg-ink border-[5px] border-ink rounded-[24px] p-4 sm:p-3"
        style={{ boxShadow: "var(--shadow-ink-lg)" }}
      >
        <div className="text-center mb-3">
          <div
            className="font-display text-sun text-stroke-ink leading-none"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              textShadow: "4px 4px 0 #E94B4B",
            }}
          >
            SUPER DOG WORLD
          </div>
          <div className="text-cream font-body mt-2 text-[0.95rem]">
            Save the dogs! Throw your hat at evil cats, capture dog mountains, grab flags, and beat the boss!
          </div>
        </div>

        <div className="flex justify-between items-center text-cream font-body font-semibold text-[1.05rem] py-2 px-3 flex-wrap gap-2">
          <div className="bg-red-deep border-2 border-cream rounded-xl px-3 py-1">
            ❤️ Lives: <span className="tabular-nums">{state.lives}</span>
          </div>
          <div className="bg-grass-deep border-2 border-cream rounded-xl px-3 py-1">
            ⭐ Score: <span className="tabular-nums">{state.score}</span>
          </div>
          <div className="bg-sky-deep border-2 border-cream rounded-xl px-3 py-1">
            🚩 Flags: <span className="tabular-nums">{state.flagsGot}</span>/5
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="game-canvas"
          />

          {phase !== "playing" && (
            <div
              className="absolute inset-0 bg-ink/85 flex flex-col justify-center items-center text-white text-center rounded-[13px] p-5 z-10"
            >
              {phase === "title" && (
                <>
                  <h2
                    className="font-display text-sun text-stroke-ink leading-none mb-4"
                    style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
                  >
                    SUPER DOG WORLD
                  </h2>
                  <p className="text-[1.2rem] mb-2 max-w-[500px] font-body">
                    The evil cat wants to turn ALL the dogs into cats!
                  </p>
                  <p className="text-[1rem] max-w-[500px] font-body">
                    Throw your hat 🎩 at cats to defeat them, at dog-mountains to bonk them, and at flags to score points.
                  </p>
                  <p className="text-[0.95rem] mt-3 font-body">
                    <KeyHint>←</KeyHint> <KeyHint>→</KeyHint> Move &nbsp;
                    <KeyHint>↑</KeyHint> / <KeyHint>SPACE</KeyHint> Jump &nbsp;
                    <KeyHint>F</KeyHint> Throw Hat
                  </p>
                  <OverlayButton onClick={startGame}>START!</OverlayButton>
                </>
              )}
              {phase === "win" && (
                <>
                  <h2 className="font-display text-sun text-stroke-ink leading-none mb-3"
                    style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}>
                    🎉 YOU WIN! 🎉
                  </h2>
                  <p className="text-[1.2rem] mb-1 font-body">
                    Harry saved Super Dog World! All the dogs are safe!
                  </p>
                  <p className="text-sun text-[1.1rem] mb-3 font-body">
                    Final Score: {state.score}
                  </p>
                  <NameForm
                    name={name}
                    setName={setName}
                    onSubmit={submitScore}
                    submitting={submitting}
                    submitError={submitError}
                  />
                  <OverlayButton onClick={startGame}>PLAY AGAIN</OverlayButton>
                </>
              )}
              {phase === "lose" && (
                <>
                  <h2 className="font-display text-sun text-stroke-ink leading-none mb-3"
                    style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}>
                    💔 OH NO!
                  </h2>
                  <p className="text-[1.2rem] mb-1 font-body">
                    The cats won this time. Try again, Harry!
                  </p>
                  <p className="text-sun text-[1.1rem] mb-3 font-body">
                    Final Score: {state.score}
                  </p>
                  {state.score > 0 && (
                    <NameForm
                      name={name}
                      setName={setName}
                      onSubmit={submitScore}
                      submitting={submitting}
                      submitError={submitError}
                    />
                  )}
                  <OverlayButton onClick={startGame}>TRY AGAIN</OverlayButton>
                </>
              )}
              {phase === "submitted" && (
                <>
                  <h2 className="font-display text-sun text-stroke-ink leading-none mb-3"
                    style={{ fontSize: "clamp(2rem, 7vw, 3rem)" }}>
                    🏆 SCORE SAVED!
                  </h2>
                  <p className="text-[1.1rem] mb-3 font-body">
                    Scroll down to see Harry&apos;s Hall of Fame!
                  </p>
                  <OverlayButton onClick={startGame}>PLAY AGAIN</OverlayButton>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 px-1">
          <button
            type="button"
            className="font-display bg-cream text-ink text-[1.4rem] sm:text-[1.1rem] py-[18px] sm:py-[16px] border-[3px] border-ink rounded-[16px] active:translate-x-[2px] active:translate-y-[2px] select-none"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}
            aria-label="Move left"
            {...bindMobileKey("ArrowLeft")}
          >
            ◀
          </button>
          <button
            type="button"
            className="font-display bg-cream text-ink text-[1.4rem] sm:text-[1.1rem] py-[18px] sm:py-[16px] border-[3px] border-ink rounded-[16px] active:translate-x-[2px] active:translate-y-[2px] select-none"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}
            aria-label="Move right"
            {...bindMobileKey("ArrowRight")}
          >
            ▶
          </button>
          <button
            type="button"
            className="font-display bg-sun text-ink text-[1.4rem] sm:text-[1.1rem] py-[18px] sm:py-[16px] border-[3px] border-ink rounded-[16px] active:translate-x-[2px] active:translate-y-[2px] select-none"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}
            aria-label="Jump"
            onTouchStart={onJumpButton}
            onMouseDown={onJumpButton}
          >
            JUMP
          </button>
          <button
            type="button"
            className="font-display bg-red text-white text-[1.4rem] sm:text-[1.1rem] py-[18px] sm:py-[16px] border-[3px] border-ink rounded-[16px] active:translate-x-[2px] active:translate-y-[2px] select-none"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.4)" }}
            aria-label="Throw hat"
            onTouchStart={onHatButton}
            onMouseDown={onHatButton}
          >
            HAT!
          </button>
        </div>
      </div>
    </section>
  );
}

function KeyHint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-white text-ink border-2 border-ink px-2 py-[2px] rounded-md font-body font-semibold mx-[2px]">
      {children}
    </span>
  );
}

function OverlayButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-red text-white font-display text-[1.5rem] py-[14px] px-8 border-[3px] border-cream rounded-[20px] mt-5 active:translate-x-[2px] active:translate-y-[2px]"
      style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.5)" }}
    >
      {children}
    </button>
  );
}

function NameForm({
  name,
  setName,
  onSubmit,
  submitting,
  submitError,
}: {
  name: string;
  setName: (n: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}) {
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-2 mt-2 mb-3">
      <label className="font-body text-cream text-[1rem]" htmlFor="player-name">
        Save your score on the leaderboard:
      </label>
      <div className="flex gap-2">
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20))}
          placeholder="Your name"
          maxLength={20}
          className="flex-1 px-3 py-2 rounded-[12px] border-[3px] border-cream bg-white text-ink font-body text-[1rem] outline-none"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="font-display bg-grass-deep text-white px-4 py-2 rounded-[12px] border-[3px] border-cream disabled:opacity-60"
          style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.4)" }}
        >
          {submitting ? "…" : "SAVE"}
        </button>
      </div>
      {submitError && (
        <p className="font-body text-[#FFC1C1] text-[0.9rem]">{submitError}</p>
      )}
    </div>
  );
}
