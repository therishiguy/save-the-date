"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  delay?: number;
}

export default function LuxuryButton({
  children,
  onClick,
  className,
  delay = 0,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "relative inline-flex items-center justify-center",
        "px-10 py-3.5 min-h-[48px]",
        "font-cormorant text-[13px] uppercase",
        "tracking-luxury text-wine",
        "border border-wine/70",
        "bg-transparent",
        "transition-colors duration-500",
        "hover:bg-wine hover:text-white",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-wine/50",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
