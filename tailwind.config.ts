import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: "#8B1E1E",
        "wine-soft": "#A33A3A",
        gold: "#D4AF37",
        "gold-light": "#E6C766",
        "gold-deep": "#9C7A1F",
        ink: "#222222",
        cream: "#FBF8F3",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
      },
      letterSpacing: {
        "luxury": "0.32em",
        "luxury-tight": "0.18em",
      },
      animation: {
        "fade-up": "fadeUp 1.2s ease-out forwards",
        "draw-line": "drawLine 1.2s ease-out forwards",
        "soft-pulse": "softPulse 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawLine: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        softPulse: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
