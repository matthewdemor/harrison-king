/**
 * Web Speech helper. Voices load asynchronously in some browsers, so we lazily
 * resolve the best available voice. Speech is gated on a user gesture in iOS
 * Safari — every place we call speak() is reached only after the player has
 * tapped a UI button at least once.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let unlocked = false;

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function refreshVoices(): SpeechSynthesisVoice | null {
  const synth = getSynth();
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) {
    cachedVoice = null;
    return null;
  }
  cachedVoice =
    voices.find(
      (v) => v.lang.startsWith("en") && /child|kid|samantha|karen/i.test(v.name),
    ) ??
    voices.find((v) => v.lang.startsWith("en-US")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null;
  return cachedVoice;
}

export function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  return refreshVoices();
}

export function ensureSpeechUnlocked() {
  if (unlocked) return;
  const synth = getSynth();
  if (!synth) return;
  // Empty utterance unlocks iOS audio; harmless on other browsers.
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    synth.speak(u);
    unlocked = true;
  } catch {
    /* noop */
  }
}

export type SpeakOpts = {
  rate?: number;
  pitch?: number;
  enabled?: boolean;
};

export function speak(text: string, opts?: SpeakOpts) {
  if (opts?.enabled === false) return;
  const synth = getSynth();
  if (!synth) return;
  try {
    synth.cancel();
  } catch {
    /* noop */
  }
  const u = new SpeechSynthesisUtterance(text);
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = opts?.rate ?? 0.9;
  u.pitch = opts?.pitch ?? 1.1;
  synth.speak(u);
}

export function attachVoiceLoader() {
  if (typeof window === "undefined") return () => {};
  const synth = getSynth();
  if (!synth) return () => {};
  refreshVoices();
  const handler = () => refreshVoices();
  synth.addEventListener?.("voiceschanged", handler);
  return () => {
    synth.removeEventListener?.("voiceschanged", handler);
  };
}
