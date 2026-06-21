"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import DecorativeDivider from "./DecorativeDivider";
import { DATE_PARTS } from "@/lib/constants";

const REVEAL_THRESHOLD = 0.6; // 60%

interface Props {
  onRevealed: () => void;
}

interface CanvasSize {
  cssW: number;
  cssH: number;
  dpr: number;
}

export default function ScratchReveal({ onRevealed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<CanvasSize>({ cssW: 0, cssH: 0, dpr: 1 });
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Paint the metallic gold overlay onto the canvas (in CSS pixel space).
  const paintOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { cssW, cssH } = sizeRef.current;
    if (!cssW || !cssH) return;

    // base radial gold
    const grad = ctx.createRadialGradient(
      cssW * 0.35,
      cssH * 0.3,
      0,
      cssW / 2,
      cssH / 2,
      Math.max(cssW, cssH) * 0.9,
    );
    grad.addColorStop(0, "#F1D67A");
    grad.addColorStop(0.45, "#D4AF37");
    grad.addColorStop(0.85, "#9C7A1F");
    grad.addColorStop(1, "#7A5E14");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssW, cssH);

    // diagonal sheen lines for metallic shimmer
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#FFF3C2";
    ctx.lineWidth = 1;
    for (let i = -cssH; i < cssW; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + cssH, cssH);
      ctx.stroke();
    }
    ctx.restore();

    // soft inner border
    ctx.strokeStyle = "rgba(255, 230, 150, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, cssW - 8, cssH - 8);

    // engraved "SCRATCH HERE" label centered
    ctx.save();
    ctx.fillStyle = "rgba(60, 40, 0, 0.55)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '300 11px "Cormorant Garamond", Georgia, serif';
    ctx.fillText("S C R A T C H   T O   R E V E A L", cssW / 2, cssH / 2);
    ctx.restore();
  }, []);

  // Setup canvas dimensions matching container
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    sizeRef.current = { cssW, cssH, dpr };
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // reset any previous transform, then apply dpr scaling so we can draw
      // using CSS pixel coordinates everywhere.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    paintOverlay();
  }, [paintOverlay]);

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setupCanvas]);

  // Triggered when threshold crossed
  const triggerReveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = "opacity 0.7s ease-out";
      canvas.style.opacity = "0";
    }

    // Confetti — elegant: wine, gold, white
    const colors = ["#8B1E1E", "#D4AF37", "#FFFFFF", "#E6C766", "#A33A3A"];
    const fire = (opts: confetti.Options) => {
      confetti({
        particleCount: 60,
        spread: 70,
        startVelocity: 32,
        ticks: 220,
        gravity: 0.85,
        scalar: 0.95,
        colors,
        ...opts,
      });
    };
    fire({ origin: { x: 0.2, y: 0.45 }, angle: 60 });
    fire({ origin: { x: 0.8, y: 0.45 }, angle: 120 });
    fire({ origin: { x: 0.5, y: 0.3 }, spread: 100, particleCount: 90 });

    window.setTimeout(() => {
      fire({ origin: { x: 0.5, y: 0.4 }, particleCount: 50, scalar: 0.7 });
    }, 600);

    window.setTimeout(onRevealed, 2000);
  }, [revealed, onRevealed]);

  // Sample the alpha channel to compute % scratched.
  // Read directly from the backing store (full pixel resolution).
  const sampleProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const w = canvas.width;
    const h = canvas.height;
    if (!w || !h) return 0;
    const stride = 16;
    let cleared = 0;
    let total = 0;
    try {
      const img = ctx.getImageData(0, 0, w, h);
      for (let y = 0; y < h; y += stride) {
        for (let x = 0; x < w; x += stride) {
          const idx = (y * w + x) * 4 + 3; // alpha
          total += 1;
          if (img.data[idx] < 32) cleared += 1;
        }
      }
    } catch {
      return 0;
    }
    return total > 0 ? cleared / total : 0;
  }, []);

  const scratchAt = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const radius = 26;

    const last = lastPointRef.current;
    if (last) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = radius * 2;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fill();
    ctx.restore();
    lastPointRef.current = { x, y };
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    drawingRef.current = true;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    lastPointRef.current = null;
    const p = getPoint(e);
    scratchAt(p.x, p.y);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || revealed) return;
    e.preventDefault();
    const p = getPoint(e);
    scratchAt(p.x, p.y);
  };

  const handleUp = () => {
    if (revealed) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    const p = sampleProgress();
    setProgress(p);
    if (p >= REVEAL_THRESHOLD) {
      triggerReveal();
    }
  };

  return (
    <section
      id="scratch"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center px-7 py-14"
    >
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="font-cormorant text-[11px] uppercase tracking-luxury text-wine/80"
      >
        An Invitation
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="mt-5 font-playfair italic text-wine"
        style={{ fontSize: "clamp(48px, 12vw, 84px)" }}
      >
        Reveal
      </motion.h2>

      <DecorativeDivider width={100} delay={0.6} />

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="font-cormorant italic text-ink/65 text-center max-w-[280px] mt-1"
        style={{ fontSize: "clamp(15px, 4vw, 18px)" }}
      >
        Scratch to discover the date
      </motion.p>

      {/* Scratch card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="relative mt-12 mb-6"
        style={{ width: "min(85vw, 320px)" }}
      >
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          {/* underlying date layer */}
          <div
            ref={containerRef}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white border border-wine/30"
          >
            <motion.div
              animate={revealed ? { scale: [0.96, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center justify-center"
            >
              <p className="font-cormorant text-[10px] uppercase tracking-luxury text-wine/80">
                The Tenth Of
              </p>
              <p
                className="font-playfair italic text-wine leading-[0.95] mt-2"
                style={{ fontSize: "clamp(36px, 11vw, 56px)" }}
              >
                {DATE_PARTS.month}
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span
                  className="font-playfair italic text-wine"
                  style={{ fontSize: "clamp(48px, 14vw, 76px)" }}
                >
                  {DATE_PARTS.day}
                </span>
                <span className="font-cormorant text-wine/70 text-[11px] uppercase tracking-luxury">
                  · {DATE_PARTS.year}
                </span>
              </div>
            </motion.div>

            {/* glow overlay on reveal */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(139,30,30,0.06) 0%, transparent 70%)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* sparkles */}
            <AnimatePresence>{revealed && <Sparkles />}</AnimatePresence>
          </div>

          {/* scratch canvas overlay */}
          <canvas
            ref={canvasRef}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
            onPointerLeave={handleUp}
            className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* tiny progress hint */}
        <p className="mt-3 text-center font-cormorant italic text-[12px] text-ink/45">
          {revealed
            ? "·"
            : progress > 0
              ? `${Math.round(progress * 100)}% revealed`
              : "tap and drag across the card"}
        </p>
      </motion.div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0 }}
            className="text-center mt-2"
          >
            <DecorativeDivider width={80} delay={0} />
            <p
              className="font-playfair italic text-wine"
              style={{ fontSize: "clamp(22px, 6vw, 32px)" }}
            >
              We&apos;re Getting Married
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Sparkles() {
  const stars = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((i) => {
        const left = 8 + ((i * 37) % 84);
        const top = 12 + ((i * 53) % 76);
        const delay = (i % 5) * 0.18;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], y: -8, scale: 1 }}
            transition={{
              duration: 2.4,
              delay,
              repeat: Infinity,
              repeatDelay: 1.6,
            }}
            className="absolute"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
              <path
                d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
                fill="#D4AF37"
                opacity="0.9"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
