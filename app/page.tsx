"use client";

import { useCallback, useState } from "react";
import HeroReveal from "@/components/HeroReveal";
import CurtainReveal from "@/components/CurtainReveal";
import ScratchReveal from "@/components/ScratchReveal";
import CountdownSection from "@/components/CountdownSection";
import MusicPlayer from "@/components/MusicPlayer";
import { smoothScrollTo } from "@/lib/utils";

type Phase = "hero" | "curtain" | "scratch" | "countdown";

export default function Page() {
  const [phase, setPhase] = useState<Phase>("hero");

  const startCurtain = useCallback(() => {
    setPhase("curtain");
  }, []);

  const curtainDone = useCallback(() => {
    setPhase("scratch");
    // give layout a beat to settle, then scroll
    window.setTimeout(() => smoothScrollTo("scratch"), 200);
  }, []);

  const dateRevealed = useCallback(() => {
    setPhase("countdown");
    window.setTimeout(() => smoothScrollTo("countdown"), 800);
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden">
      <HeroReveal onOpen={startCurtain} />

      {/* Sections 2 + 3 are present in DOM but only mounted once we've passed
          the curtain — keeps the initial hero distraction-free. */}
      {phase !== "hero" && (
        <>
          <ScratchReveal onRevealed={dateRevealed} />
          <CountdownSection />
        </>
      )}

      <CurtainReveal active={phase === "curtain"} onComplete={curtainDone} />
      <MusicPlayer />
    </main>
  );
}
