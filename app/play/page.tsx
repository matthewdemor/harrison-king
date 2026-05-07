import Link from "next/link";
import { Cloud } from "@/components/Cloud";
import { SuperDogWorld } from "@/components/SuperDogWorld";
import { Leaderboard } from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";

export const revalidate = 30;

export default function PlayPage() {
  return (
    <>
      <div
        aria-hidden
        className="absolute top-[30px] right-[30px] w-[90px] h-[90px] rounded-full bg-sun pointer-events-none z-[1] sm:w-[60px] sm:h-[60px] sm:top-5 sm:right-5"
        style={{
          boxShadow:
            "0 0 0 8px rgba(255,224,102,0.4), 0 0 0 18px rgba(255,224,102,0.2)",
          animation: "var(--animate-sun-pulse)",
        }}
      />
      <Cloud variant={1} />
      <Cloud variant={2} />
      <Cloud variant={3} />

      <main className="pt-[60px] pb-10 px-3">
        <div className="max-w-[900px] mx-auto mb-4 flex items-center gap-3">
          <Link
            href="/"
            className="font-display bg-cream text-ink px-4 py-2 rounded-[14px] border-[3px] border-ink inline-flex items-center gap-2 active:translate-x-[2px] active:translate-y-[2px]"
            style={{ boxShadow: "var(--shadow-ink-sm)" }}
          >
            ← <span className="text-[1.1rem]">Home</span>
          </Link>
          <h1
            className="font-display text-red text-stroke-ink leading-none"
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              transform: "rotate(-1.5deg)",
              textShadow: "3px 3px 0 #2D3142",
            }}
          >
            Super Dog World 🐶
          </h1>
        </div>

        <SuperDogWorld />
        <Leaderboard />
      </main>
      <div className="grass-strip" />
      <Footer />
    </>
  );
}
