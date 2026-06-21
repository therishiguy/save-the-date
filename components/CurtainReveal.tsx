"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  active: boolean;
  onComplete: () => void;
}

/**
 * Full-screen theatre curtain overlay.
 * Two SVG panels slide in from offscreen, settle, then split apart.
 * Total duration ~2.5s.
 */
export default function CurtainReveal({ active, onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!active) return;
    if (!leftRef.current || !rightRef.current || !overlayRef.current) return;

    // ensure overlay is visible
    gsap.set(overlayRef.current, { autoAlpha: 1 });
    gsap.set(leftRef.current, { xPercent: -110 });
    gsap.set(rightRef.current, { xPercent: 110 });

    const tl = gsap.timeline({
      onComplete: () => {
        // brief hold then notify
        window.setTimeout(onComplete, 250);
      },
    });
    tlRef.current = tl;

    // slide in
    tl.to(
      leftRef.current,
      { xPercent: 0, duration: 0.9, ease: "power3.out" },
      0,
    );
    tl.to(
      rightRef.current,
      { xPercent: 0, duration: 0.9, ease: "power3.out" },
      0,
    );

    // hold
    tl.to({}, { duration: 0.35 });

    // split apart
    tl.to(
      leftRef.current,
      { xPercent: -110, duration: 1.4, ease: "power3.inOut" },
      ">",
    );
    tl.to(
      rightRef.current,
      { xPercent: 110, duration: 1.4, ease: "power3.inOut" },
      "<",
    );

    // fade overlay container
    tl.to(
      overlayRef.current,
      { autoAlpha: 0, duration: 0.4, ease: "power1.out" },
      ">-0.2",
    );

    return () => {
      tl.kill();
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ visibility: "hidden" }}
      aria-hidden
    >
      <div className="absolute inset-0 flex">
        <CurtainPanel side="left" innerRef={leftRef} />
        <CurtainPanel side="right" innerRef={rightRef} />
      </div>
      {/* top valance / pelmet */}
      <div
        className="absolute top-0 left-0 right-0 h-6"
        style={{
          background:
            "linear-gradient(180deg, #4a0a0a 0%, #2a0606 60%, transparent 100%)",
        }}
      />
    </div>
  );
}

function CurtainPanel({
  side,
  innerRef,
}: {
  side: "left" | "right";
  innerRef: React.RefObject<HTMLDivElement>;
}) {
  // Vertical fabric folds rendered via repeating linear-gradient.
  // Wine palette so it reads as deep theatre velvet.
  const folds = `repeating-linear-gradient(
    90deg,
    #5a0d0d 0px,
    #7a1414 18px,
    #9c1f1f 36px,
    #7a1414 54px,
    #5a0d0d 72px
  )`;

  const sheen =
    side === "left"
      ? "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 75%, rgba(0,0,0,0.55) 100%)"
      : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.45) 100%)";

  return (
    <div
      ref={innerRef}
      className="relative w-1/2 h-full"
      style={{
        backgroundImage: `${sheen}, ${folds}`,
        backgroundBlendMode: "multiply",
        boxShadow:
          side === "left"
            ? "inset -12px 0 32px rgba(0,0,0,0.6)"
            : "inset 12px 0 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* subtle gold tassel rope at the inner edge */}
      <div
        className={`absolute top-0 bottom-0 w-[1.5px] ${
          side === "left" ? "right-0" : "left-0"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #d4af37 0%, #9c7a1f 50%, #d4af37 100%)",
          opacity: 0.55,
        }}
      />
    </div>
  );
}
