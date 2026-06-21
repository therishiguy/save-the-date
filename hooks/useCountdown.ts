"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: Date): Countdown {
  const now = Date.now();
  const delta = target.getTime() - now;
  if (delta <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((delta / (1000 * 60)) % 60);
  const seconds = Math.floor((delta / 1000) % 60);
  return { days, hours, minutes, seconds, done: false };
}

export function useCountdown(target: Date): Countdown {
  const [value, setValue] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  });

  useEffect(() => {
    setValue(diff(target));
    const id = window.setInterval(() => setValue(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return value;
}
