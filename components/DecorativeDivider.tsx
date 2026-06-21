"use client";

import { motion } from "framer-motion";

interface Props {
  width?: number;
  delay?: number;
  color?: string;
}

export default function DecorativeDivider({
  width = 180,
  delay = 0,
  color = "#8B1E1E",
}: Props) {
  return (
    <div
      className="flex items-center justify-center my-6"
      style={{ width: "100%" }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1,
          width,
          backgroundColor: color,
          opacity: 0.55,
          transformOrigin: "right center",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.9 }}
        className="mx-3"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
            fill={color}
            opacity="0.7"
          />
        </svg>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 1,
          width,
          backgroundColor: color,
          opacity: 0.55,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
