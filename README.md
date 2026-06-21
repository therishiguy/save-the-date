# Rishi & Taniya — Save The Date

A luxury interactive digital Save The Date invitation. Built to feel like a
European wedding invitation viewed on an iPhone and recorded for Instagram Reels.

Three acts only:

1. **Opening Reveal** — names, divider, "Open Invitation" button
2. **Scratch To Reveal** — gold scratch panel uncovers 10 September 2027
3. **Countdown** — live four-card countdown to the wedding date

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- TailwindCSS 3
- Framer Motion (micro animations)
- GSAP (curtain transition)
- canvas-confetti (reveal celebration)
- lucide-react (music icon)
- Google Fonts: Cormorant Garamond + Playfair Display via `next/font`

## File Structure

```
save-the-date/
├── app/
│   ├── layout.tsx          # fonts, metadata, viewport
│   ├── page.tsx            # phase orchestration (hero → curtain → scratch → countdown)
│   └── globals.css         # base styles + paper grain util
├── components/
│   ├── HeroReveal.tsx      # Section 1
│   ├── CurtainReveal.tsx   # GSAP theatre curtain
│   ├── ScratchReveal.tsx   # Section 2 — canvas scratch + confetti
│   ├── CountdownSection.tsx# Section 3
│   ├── MusicPlayer.tsx     # floating music toggle
│   ├── LuxuryButton.tsx    # shared thin-border button
│   ├── DecorativeDivider.tsx # hairline + center ornament
│   └── VillaCrest.tsx      # SVG villa silhouette
├── hooks/
│   └── useCountdown.ts
├── lib/
│   ├── constants.ts        # date, names, palette
│   └── utils.ts            # cn(), smoothScrollTo()
├── public/
│   └── music/              # drop romantic.mp3 here
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── package.json
├── DESIGN_ANALYSIS.md      # the design audit + recreation plan
└── README.md
```

## Installation

```bash
cd save-the-date
npm install
npm run dev
```

Open `http://localhost:3000` on your phone (or use Chrome DevTools'
device toolbar at 390×844 / iPhone 15 Pro).

## Customising

| Thing                 | Where                                  |
|-----------------------|----------------------------------------|
| Names                 | `lib/constants.ts` → `NAMES`           |
| Date                  | `lib/constants.ts` → `WEDDING_DATE_ISO`|
| Colors                | `tailwind.config.ts` → `colors`        |
| Scratch threshold     | `components/ScratchReveal.tsx` → `REVEAL_THRESHOLD` |
| Curtain duration      | `components/CurtainReveal.tsx` → GSAP timeline |
| Music                 | place `public/music/romantic.mp3`      |

## Assets

The project ships with zero external image dependencies — every decorative
element (villa crest, dividers, scalloped frame, curtains, sparkles) is
inline SVG or canvas. The only asset you supply is the optional
`public/music/romantic.mp3` background track.

## Deploying to Vercel

```bash
npm install -g vercel        # if not already installed
vercel login                 # sign in with GitHub
vercel                       # follow prompts, accept defaults
vercel --prod                # promote to production
```

Or, via the dashboard:

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), click **New Project**, import the repo.
3. Framework preset auto-detects **Next.js**. No env vars needed.
4. Click **Deploy**.

Custom domain: Project → Settings → Domains → add your domain, follow the
DNS instructions Vercel shows (A record `76.76.21.21` or CNAME to
`cname.vercel-dns.com`).

## Mobile QA Checklist

- [ ] Names + button fit comfortably at 390×844 with safe-area padding
- [ ] Curtain spans the full viewport including notch area
- [ ] Scratch canvas accepts touch (no scroll hijack while dragging)
- [ ] Confetti renders above the canvas, below the music button
- [ ] Countdown cells don't wrap at narrow widths
- [ ] Music button stays clear of iOS home indicator (24px from bottom)

## Design Reference

See `DESIGN_ANALYSIS.md` for the full design audit drawn from the
reference screenshots.
