"use client";

import { motion } from "framer-motion";
import DecorativeDivider from "./DecorativeDivider";
import LuxuryButton from "./LuxuryButton";
import VillaCrest from "./VillaCrest";
import { NAMES } from "@/lib/constants";

interface Props {
  onOpen: () => void;
}

export default function HeroReveal({ onOpen }: Props) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-7 py-16"
    >
      {/* Outer scalloped frame (subtle, on white) */}
      <ScallopedFrame />

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="text-center"
      >
        <p className="font-cormorant text-[11px] uppercase tracking-luxury text-wine/80">
          The Wedding of
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 text-center font-playfair italic text-wine leading-[1.05]"
        style={{ fontSize: "clamp(56px, 13vw, 96px)" }}
      >
        {NAMES.first}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.0 }}
        className="my-3 font-cormorant italic text-wine/70"
        style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
      >
        &amp;
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center font-playfair italic text-wine leading-[1.05]"
        style={{ fontSize: "clamp(56px, 13vw, 96px)" }}
      >
        {NAMES.second}
      </motion.h1>

      <DecorativeDivider width={120} delay={1.8} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="mt-2 mb-10 flex flex-col items-center gap-4"
      >
        <VillaCrest width={76} color="#8B1E1E" />
        <p className="font-cormorant text-[12px] uppercase tracking-luxury text-ink/75">
          Save The Date
        </p>
        <p className="font-cormorant italic text-ink/60 text-[15px] mt-1">
          Together with their families
        </p>
      </motion.div>

      <LuxuryButton onClick={onOpen} delay={2.7}>
        Open Invitation
      </LuxuryButton>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 3.4 }}
        className="absolute bottom-8 font-cormorant italic text-[12px] tracking-luxury-tight text-wine/40"
      >
        — tap to begin —
      </motion.p>
    </section>
  );
}

function ScallopedFrame() {
  // A decorative wavy hairline frame echoing the printed invitation.
  return (
    <svg
      className="pointer-events-none absolute inset-4 sm:inset-6"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <pattern
          id="scallop-top"
          x="0"
          y="0"
          width="4"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 1 Q1 -0.5 2 1 T4 1"
            fill="none"
            stroke="#8B1E1E"
            strokeOpacity="0.35"
            strokeWidth="0.18"
          />
        </pattern>
      </defs>
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        fill="none"
        stroke="url(#scallop-top)"
        strokeWidth="0.4"
      />
      <rect
        x="2.4"
        y="2.4"
        width="95.2"
        height="95.2"
        fill="none"
        stroke="#8B1E1E"
        strokeOpacity="0.25"
        strokeWidth="0.12"
      />
    </svg>
  );
}
