"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause } from "lucide-react";

/**
 * Floating bottom-right music toggle.
 * Drop a file at /public/music/romantic.mp3 for ambient audio.
 * Defaults to muted; user-initiated play satisfies browser autoplay policies.
 */
export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.35;
    a.loop = true;
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (playing) {
        a.pause();
        setPlaying(false);
      } else {
        await a.play();
        setPlaying(true);
      }
    } catch {
      // file may be missing; fail quietly
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="none" src="/music/romantic.mp3" />
      <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileTap={{ scale: 0.94 }}
        aria-label={playing ? "Pause music" : "Play music"}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm border border-wine/40 flex items-center justify-center text-wine hover:bg-wine hover:text-white transition-colors duration-500"
        style={{ boxShadow: "0 1px 0 rgba(139,30,30,0.05)" }}
      >
        {playing ? (
          <Pause size={16} strokeWidth={1.4} />
        ) : (
          <Music size={16} strokeWidth={1.4} />
        )}
        {playing && (
          <span
            className="absolute inset-0 rounded-full border border-wine/30 animate-soft-pulse"
            aria-hidden
          />
        )}
      </motion.button>
    </>
  );
}
