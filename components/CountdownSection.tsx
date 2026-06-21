"use client";

import { motion, AnimatePresence } from "framer-motion";
import DecorativeDivider from "./DecorativeDivider";
import VillaCrest from "./VillaCrest";
import { useCountdown } from "@/hooks/useCountdown";
import { WEDDING_DATE, DATE_PARTS } from "@/lib/constants";

export default function CountdownSection() {
  const c = useCountdown(WEDDING_DATE);

  return (
    <section
      id="countdown"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-7 py-16"
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="font-cormorant text-[11px] uppercase tracking-luxury text-wine/80"
      >
        The Countdown Begins
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="mt-5 text-center font-playfair italic text-wine leading-[1.05]"
        style={{ fontSize: "clamp(36px, 9vw, 64px)" }}
      >
        Countdown To<br />Our Wedding
      </motion.h2>

      <DecorativeDivider width={120} delay={0.6} />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 1.0 }}
        className="grid grid-cols-4 gap-3 sm:gap-5 mt-8 w-full max-w-[440px]"
      >
        <Cell label="Days" value={c.days} pad={3} />
        <Cell label="Hours" value={c.hours} pad={2} />
        <Cell label="Minutes" value={c.minutes} pad={2} />
        <Cell label="Seconds" value={c.seconds} pad={2} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="mt-14 flex flex-col items-center gap-4"
      >
        <VillaCrest width={72} />
        <p className="font-cormorant text-[11px] uppercase tracking-luxury text-wine/80">
          The Wedding Of
        </p>
        <p
          className="font-playfair italic text-wine leading-none"
          style={{ fontSize: "clamp(28px, 7vw, 40px)" }}
        >
          Rishi <span className="text-wine/55">&amp;</span> Taniya
        </p>
        <p className="font-cormorant italic text-ink/60 mt-1">
          {DATE_PARTS.day} {DATE_PARTS.month} {DATE_PARTS.year}
        </p>
      </motion.div>

      <p className="absolute bottom-8 font-cormorant italic text-[12px] tracking-luxury-tight text-wine/40">
        — with love —
      </p>
    </section>
  );
}

function Cell({
  label,
  value,
  pad,
}: {
  label: string;
  value: number;
  pad: number;
}) {
  const display = String(value).padStart(pad, "0");
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full border border-wine/35 px-2 py-4 flex items-center justify-center bg-white"
        style={{ minHeight: 78 }}
      >
        <div className="relative h-[44px] sm:h-[52px] overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="font-playfair italic text-wine tabular-nums"
              style={{ fontSize: "clamp(28px, 7vw, 44px)", lineHeight: 1 }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <p className="mt-2 font-cormorant uppercase text-[10px] tracking-luxury text-ink/60">
        {label}
      </p>
    </div>
  );
}
