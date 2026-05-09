"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { H, W } from "@/lib/game/constants";
import { createInitialState } from "@/lib/game/state";
import { render } from "@/lib/game/render";
import {
  getLabelTargets,
  throwHat as engineThrowHat,
  tryJump as engineTryJump,
  update as engineUpdate,
} from "@/lib/game/engine";
import type { GameState, HeartStone, Keys } from "@/lib/game/types";
import { HEART_WORDS, HEART_WORD_COUNT } from "@/lib/words/heart-words";
import { attachVoiceLoader, ensureSpeechUnlocked, speak } from "@/lib/audio/speak";
import { HeartWordCard } from "./HeartWordCard";
import { HeartWordGate } from "./HeartWordGate";
import { SettingsToggles } from "./SettingsToggles";

type Phase = "title" | "playing" | "win" | "lose" | "submitted";

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};
type FsElement = HTMLDivElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

type ActiveCard =
  | { kind: "heart"; stone: HeartStone }
  | { kind: "label"; word: string }
  | null;

const LABELS_KEY = "hk-game-labels-on";
const SPEECH_KEY = "hk-game-speech-on";

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "1";
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* noop */
  }
}

export function SuperDogWorld() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
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
  const [isFs, setIsFs] = useState(false);
  const [cssFs, setCssFs] = useState(false);

  const [labelsOn, setLabelsOn] = useState<boolean>(true);
  const [speechOn, setSpeechOn] = useState<boolean>(true);
  const labelsOnRef = useRef(true);
  const speechOnRef = useRef(true);
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);
  const [gateUiOpen, setGateUiOpen] = useState(false);
  const [, setTickWords] = useState(0);

  const setPaused = useCallback((p: boolean) => {
    stateRef.current.paused = p;
  }, []);

  // Restore preferences on mount.
  useEffect(() => {
    const l = readBool(LABELS_KEY, true);
    const s = readBool(SPEECH_KEY, true);
    setLabelsOn(l);
    setSpeechOn(s);
    labelsOnRef.current = l;
    speechOnRef.current = s;
  }, []);

  useEffect(() => {
    labelsOnRef.current = labelsOn;
    writeBool(LABELS_KEY, labelsOn);
  }, [labelsOn]);

  useEffect(() => {
    speechOnRef.current = speechOn;
    writeBool(SPEECH_KEY, speechOn);
  }, [speechOn]);

  // Voices for Web Speech API
  useEffect(() => {
    return attachVoiceLoader();
  }, []);

  const requestFullscreen = useCallback(async () => {
    const el = cardRef.current as FsElement | null;
    if (!el) return;
    const fn = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (typeof fn === "function") {
      try {
        await fn.call(el);
        const orientation = (screen.orientation as ScreenOrientation & {
          lock?: (o: string) => Promise<void>;
        } | undefined);
        if (orientation && typeof orientation.lock === "function") {
          orientation.lock("landscape").catch(() => undefined);
        }
        return;
      } catch {
        /* fall through */
      }
    }
    setCssFs(true);
  }, []);

  const exitFullscreen = useCallback(async () => {
    setCssFs(false);
    const doc = document as FsDocument;
    if (doc.fullscreenElement && typeof document.exitFullscreen === "function") {
      try { await document.exitFullscreen(); } catch {}
    } else if (doc.webkitFullscreenElement && typeof doc.webkitExitFullscreen === "function") {
      try { await doc.webkitExitFullscreen(); } catch {}
    }
    const orientation = screen.orientation as ScreenOrientation & {
      unlock?: () => void;
    } | undefined;
    if (orientation && typeof orientation.unlock === "function") {
      try { orientation.unlock(); } catch {}
    }
  }, []);

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

  const triggerHeartStone = useCallback((stone: HeartStone) => {
    setPaused(true);
    setActiveCard({ kind: "heart", stone });
  }, [setPaused]);

  const triggerOwl = useCallback(() => {
    setPaused(true);
    setGateUiOpen(true);
  }, [setPaused]);

  const closeHeartCard = useCallback(() => {
    setActiveCard((current) => {
      if (current?.kind === "heart") {
        const stone = current.stone;
        // Mark collected + register the word
        const live = stateRef.current.heartStones.find((s) => s.id === stone.id);
        if (live && !live.collected) {
          live.collected = true;
          stateRef.current.collectedWords[live.word] = true;
          // Sparkle particles via direct push (engine spawnParticles imported via state mutation)
          for (let i = 0; i < 16; i++) {
            stateRef.current.particles.push({
              x: live.x + live.w / 2,
              y: live.y + live.h / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6 - 2,
              life: 36 + Math.random() * 16,
              color: i % 2 === 0 ? "#FFE066" : "#E97AC1",
              size: 3 + Math.random() * 4,
            });
          }
          setTickWords((n) => n + 1);
        }
      }
      return null;
    });
    setPaused(false);
  }, [setPaused]);

  const closeLabelCard = useCallback(() => {
    setActiveCard(null);
    setPaused(false);
  }, [setPaused]);

  const closeGate = useCallback(() => {
    setGateUiOpen(false);
    // Reset trigger so player can re-approach owl
    stateRef.current.owl.triggered = false;
    setPaused(false);
  }, [setPaused]);

  const openGate = useCallback(() => {
    stateRef.current.gateOpen = true;
    setGateUiOpen(false);
    // Big celebratory burst
    for (let i = 0; i < 60; i++) {
      stateRef.current.particles.push({
        x: stateRef.current.owl.x + stateRef.current.owl.w / 2,
        y: stateRef.current.owl.y + 30,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 4,
        life: 50 + Math.random() * 30,
        color: ["#FFE066", "#E97AC1", "#7DC383", "#5BA8D0"][i % 4]!,
        size: 3 + Math.random() * 4,
      });
    }
    setPaused(false);
    setTickWords((n) => n + 1);
  }, [setPaused]);

  const startGame = useCallback(() => {
    setSubmitError(null);
    setActiveCard(null);
    setGateUiOpen(false);
    stateRef.current = createInitialState();
    setPhaseSync("playing");
    lastTimeRef.current = performance.now();
    ensureSpeechUnlocked();
    void requestFullscreen();

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
        onHeartStone: (stone) => {
          triggerHeartStone(stone);
        },
        onOwl: () => {
          triggerOwl();
        },
      });
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const targets = labelsOnRef.current ? getLabelTargets(state) : undefined;
          render(ctx, state, { labelsOn: labelsOnRef.current, labelTargets: targets });
        }
      }
      forceTick((n) => (n + 1) % 1_000_000);
      if (phaseRef.current === "playing") {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    stopLoop();
    rafRef.current = requestAnimationFrame(loop);
  }, [setPhaseSync, stopLoop, requestFullscreen, triggerHeartStone, triggerOwl]);

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
      if (stateRef.current.paused) return;
      if (e.code === "KeyF" || e.code === "KeyX") engineThrowHat(stateRef.current);
      if (e.code === "Space" || e.code === "ArrowUp") engineTryJump(stateRef.current);
      if (e.code === "KeyE") {
        // Speak the word for whatever is closest to the player
        const state = stateRef.current;
        const targets = getLabelTargets(state);
        const px = state.player.x + state.player.w / 2;
        const py = state.player.y + state.player.h / 2;
        let best = null as null | { word: string; d: number };
        for (const lt of targets) {
          if (lt.kind === "dog") continue;
          const tx = lt.x + lt.w / 2;
          const ty = lt.y + lt.h / 2;
          const d = Math.hypot(tx - px, ty - py);
          if (!best || d < best.d) best = { word: lt.word, d };
        }
        if (best) {
          setPaused(true);
          setActiveCard({ kind: "label", word: best.word });
        }
      }
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
  }, [setPaused]);

  useEffect(() => () => stopLoop(), [stopLoop]);

  useEffect(() => {
    const sync = () => {
      const doc = document as FsDocument;
      const native = !!(document.fullscreenElement || doc.webkitFullscreenElement);
      setIsFs(native);
      if (!native) setCssFs(false);
    };
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  const fullscreenActive = isFs || cssFs;

  const handleExitFullscreen = useCallback(() => {
    void exitFullscreen();
  }, [exitFullscreen]);

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

  /** Detect taps on labelable entities (translates click→world coords, finds the topmost target). */
  const onCanvasPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== "playing") return;
    if (stateRef.current.paused) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const worldX = cx + stateRef.current.camera.x;
    const worldY = cy;
    // Test heart stones first — tapping speaks the word but does NOT collect.
    for (const s of stateRef.current.heartStones) {
      if (s.collected) continue;
      if (worldX >= s.x - 6 && worldX <= s.x + s.w + 6 && worldY >= s.y - 28 && worldY <= s.y + s.h) {
        setPaused(true);
        setActiveCard({ kind: "label", word: s.word });
        return;
      }
    }
    if (!labelsOnRef.current) return;
    // Test labelable entities
    const targets = getLabelTargets(stateRef.current);
    for (const lt of targets) {
      if (worldX >= lt.x && worldX <= lt.x + lt.w && worldY >= lt.y && worldY <= lt.y + lt.h) {
        setPaused(true);
        setActiveCard({ kind: "label", word: lt.word });
        return;
      }
    }
  }, [setPaused]);

  const state = stateRef.current;
  const collectedCount = HEART_WORDS.filter((w) => state.collectedWords[w]).length;

  return (
    <section className="px-4 py-10 sm:py-20 sm:px-2">
      <div
        ref={cardRef}
        className={`game-card max-w-[900px] mx-auto bg-ink border-[5px] border-ink rounded-[24px] p-4 sm:p-3${cssFs ? " css-fullscreen" : ""}`}
        style={{ boxShadow: "var(--shadow-ink-lg)" }}
      >
        {fullscreenActive && (
          <button
            type="button"
            onClick={handleExitFullscreen}
            className="fs-exit-btn"
            aria-label="Exit fullscreen"
            title="Exit fullscreen"
          >
            ✕
          </button>
        )}
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
            Save the dogs! Collect heart words, throw your hat at evil cats, capture dog mountains, grab flags, and beat the boss!
          </div>
        </div>

        <div className="flex justify-between items-center text-cream font-body font-semibold text-[0.95rem] sm:text-[1.05rem] py-2 px-2 sm:px-3 flex-wrap gap-2">
          <div className="bg-red-deep border-2 border-cream rounded-xl px-3 py-1">
            ❤️ <span className="tabular-nums">{state.lives}</span>
          </div>
          <div className="bg-grass-deep border-2 border-cream rounded-xl px-3 py-1">
            ⭐ <span className="tabular-nums">{state.score}</span>
          </div>
          <div className="bg-sky-deep border-2 border-cream rounded-xl px-3 py-1">
            🚩 <span className="tabular-nums">{state.flagsGot}</span>/5
          </div>
          <div
            className="border-2 border-cream rounded-xl px-3 py-1"
            style={{ background: collectedCount === HEART_WORD_COUNT ? "#9C3E94" : "#C254B0" }}
          >
            📖 <span className="tabular-nums">{collectedCount}</span>/{HEART_WORD_COUNT}
          </div>
          <SettingsToggles
            labelsOn={labelsOn}
            speechOn={speechOn}
            onToggleLabels={() => setLabelsOn((v) => !v)}
            onToggleSpeech={() => setSpeechOn((v) => !v)}
          />
        </div>

        <div className="relative game-wrapper">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={`game-canvas${phase === "playing" ? " is-playing" : ""}`}
            onPointerDown={onCanvasPointerDown}
          />

          {activeCard?.kind === "heart" && (
            <HeartWordCard
              word={activeCard.stone.word}
              speechEnabled={speechOn}
              onClose={closeHeartCard}
            />
          )}
          {activeCard?.kind === "label" && (
            <HeartWordCard
              word={activeCard.word}
              autoDismiss
              speechEnabled={speechOn}
              onClose={closeLabelCard}
            />
          )}
          {gateUiOpen && (
            <HeartWordGate
              collected={state.collectedWords}
              speechEnabled={speechOn}
              onClose={closeGate}
              onOpenGate={openGate}
            />
          )}

          {phase !== "playing" && !activeCard && !gateUiOpen && (
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
                  <p className="text-[1.2rem] mb-2 max-w-[520px] font-body">
                    The evil cat wants to turn ALL the dogs into cats!
                  </p>
                  <p className="text-[1rem] max-w-[520px] font-body">
                    Throw your hat 🎩 at cats, grab flags, and collect <strong>20 heart words</strong> to open the Wise Owl&apos;s gate.
                  </p>
                  <p className="text-[0.95rem] mt-3 font-body">
                    <KeyHint>←</KeyHint> <KeyHint>→</KeyHint> Move &nbsp;
                    <KeyHint>↑</KeyHint> / <KeyHint>SPACE</KeyHint> Jump &nbsp;
                    <KeyHint>F</KeyHint> Hat &nbsp;
                    <KeyHint>E</KeyHint> Read
                  </p>
                  <OverlayButton onClick={() => { ensureSpeechUnlocked(); startGame(); }}>START!</OverlayButton>
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
                    Final Score: {state.score} · Heart Words: {collectedCount}/{HEART_WORD_COUNT}
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
                    Final Score: {state.score} · Heart Words: {collectedCount}/{HEART_WORD_COUNT}
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
