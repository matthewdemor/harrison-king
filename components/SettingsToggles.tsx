"use client";

type Props = {
  labelsOn: boolean;
  speechOn: boolean;
  onToggleLabels: () => void;
  onToggleSpeech: () => void;
};

export function SettingsToggles({ labelsOn, speechOn, onToggleLabels, onToggleSpeech }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleLabels}
        aria-pressed={labelsOn}
        title={labelsOn ? "Hide word labels" : "Show word labels"}
        className="font-display bg-cream text-ink border-[3px] border-ink rounded-[12px] w-11 h-9 flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px]"
        style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.4)", fontSize: "1.05rem" }}
      >
        {labelsOn ? "📚" : "📕"}
      </button>
      <button
        type="button"
        onClick={onToggleSpeech}
        aria-pressed={speechOn}
        title={speechOn ? "Mute speech" : "Unmute speech"}
        className="font-display bg-cream text-ink border-[3px] border-ink rounded-[12px] w-11 h-9 flex items-center justify-center active:translate-x-[2px] active:translate-y-[2px]"
        style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.4)", fontSize: "1.05rem" }}
      >
        {speechOn ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
