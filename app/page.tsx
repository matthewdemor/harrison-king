import { Hero } from "@/components/Hero";
import { MeetHarry } from "@/components/MeetHarry";
import { FavoriteThings } from "@/components/FavoriteThings";
import { WhyCool } from "@/components/WhyCool";
import { SuperDogWorld } from "@/components/SuperDogWorld";
import { Leaderboard } from "@/components/Leaderboard";
import { Footer } from "@/components/Footer";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Cloud } from "@/components/Cloud";

export const revalidate = 30;

export default function Home() {
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

      <main>
        <Hero />
        <MeetHarry />
        <FavoriteThings />
        <WhyCool />
        <SuperDogWorld />
        <Leaderboard />
      </main>
      <div className="grass-strip" />
      <Footer />
      <InstallPrompt />
    </>
  );
}
