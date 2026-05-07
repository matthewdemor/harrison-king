"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "hk-install-dismissed";

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS-only
      window.navigator.standalone === true;
    if (isStandalone) return;

    const ua = window.navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);
    setIsIos(ios);

    if (ios) {
      const t = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(t);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed left-3 right-3 z-[50] bg-cream border-[3px] border-ink rounded-[18px] px-4 py-3 flex items-center gap-3 ios-instruct"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        boxShadow: "var(--shadow-ink-sm)",
      }}
    >
      <span className="text-[1.7rem]" aria-hidden>
        🐾
      </span>
      <div className="flex-1 text-ink">
        {isIos ? (
          <p className="text-[0.95rem] leading-tight">
            Tap <strong>Share</strong> then <strong>&ldquo;Add to Home Screen&rdquo;</strong> to install Harry&apos;s app!
          </p>
        ) : (
          <p className="text-[0.95rem] leading-tight">
            Install Harry&apos;s App for full-screen play!
          </p>
        )}
      </div>
      {!isIos && deferred && (
        <button
          onClick={async () => {
            await deferred.prompt();
            const choice = await deferred.userChoice;
            if (choice.outcome === "accepted") setShow(false);
          }}
          className="font-display bg-red text-white px-3 py-2 rounded-[12px] border-[3px] border-ink"
          style={{ boxShadow: "3px 3px 0 #2D3142" }}
        >
          Install
        </button>
      )}
      <button
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setShow(false);
        }}
        className="font-display text-ink text-[1.2rem] px-2 py-1"
      >
        ✕
      </button>
    </div>
  );
}
