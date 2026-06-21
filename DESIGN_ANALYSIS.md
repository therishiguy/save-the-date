# Design Analysis — Rishi & Taniya Save The Date

Source of truth: screenshots in `C:/Users/RishiGandhi/screenshots for save the date/`
(IMG-6176 → IMG-6180). Each shows a hand holding an iPhone 15 Pro displaying the
target experience, recorded vertically for Instagram Reels.

## 1. Design Observations

### Aesthetic
- Italian / Tuscan luxury wedding invitation — think Villa Medicea, Amalfi Coast,
  Como private weddings.
- Printed-stationery feel: hand-illustrated borders, ink linework, monogram crests.
- White / very soft cream background (#FFFFFF base). No textures, no gradients,
  no glass.
- The single accent color is a deep burgundy / wine red (closer to #8B1E1E than
  to pure crimson). Gold (#D4AF37) is a secondary metallic for the scratch
  overlay and divider ornaments only.

### Typography
- Display headings: a high-contrast italic serif (Cormorant Garamond italic and
  Playfair Display italic). Used for the names "Rishi & Taniya", "Reveal",
  "We're Getting Married", and the date.
- Eyebrow / label text: small, wide-tracked, uppercase serif. Used for
  "SAVE THE DATE" and section labels.
- Body: light-weight Cormorant Garamond regular, generous line-height.
- All text is set in deep wine — never pure black.

### Spacing & Layout
- Mobile-first, single column, content centered both axes.
- Very generous vertical whitespace — every screen breathes.
- Horizontal padding ~28-32px on iPhone.
- Sections are full-viewport-height; the user "flips" between them rather than
  scrolling a long page.

### Decorative Elements
- Thin hairline rules (1px wine) used as section dividers, often with a tiny
  ornament (diamond, fleur, or asterisk) at the midpoint.
- Scalloped / wavy frame borders on the invitation card (IMG-6180).
- A small architectural line-drawing (villa silhouette) as a recurring crest.
- Monogram "R & T" appearing in the invitation card header.

### Visual Hierarchy (per screen)
1. Tiny eyebrow label (e.g. "SAVE THE DATE")
2. Large italic serif headline (names or word)
3. Hairline divider with center ornament
4. Supporting body text in italic
5. CTA — thin-bordered button, wide letter-spacing

## 2. Animation Flow (observed across the 5 frames)

- Screen 1 (IMG-6180 implied entry): static invitation card. Names + crest.
- Screen 2 (IMG-6176): "Reveal" header with a gold scratch panel covering the
  date. Finger is just landing on the panel.
- Screen 3 (IMG-6177): mid-scratch — gold is being abraded away, the digits
  "10" / "Sept" / "2027" peek through.
- Screen 4 (IMG-6178): confetti burst the moment scratch crosses threshold —
  wine + gold + white flakes scattered across the white field.
- Screen 5 (IMG-6179): post-reveal calm — villa illustration with the date
  beneath, full layout settled, soft fade-in.

So the experience reads as a three-act loop:

```
Open Invitation → Curtain → Scratch → Confetti → Countdown
```

## 3. Component Breakdown

| Component          | Role                                                         |
|--------------------|--------------------------------------------------------------|
| HeroReveal         | Section 1 — names, SAVE THE DATE, Open Invitation button     |
| CurtainReveal      | Full-screen GSAP theatre-curtain transition                  |
| ScratchReveal      | Section 2 — canvas scratch panel + revealed date             |
| CountdownSection   | Section 3 — live four-card countdown                         |
| MusicPlayer        | Floating mute / play button, bottom-right                    |
| LuxuryButton       | Shared thin-border button primitive                          |
| DecorativeDivider  | Hairline rule with center ornament (reused)                  |
| VillaCrest         | Small inline SVG villa silhouette (reused)                   |

## 4. Animation Sequence

```
t=0.0s   HeroReveal mounts. Names stagger-fade-up from y+12, opacity 0→1.
         Divider draws left-and-right from center (scaleX 0→1, 1.2s).
         "Open Invitation" fades in last (delay 1.4s).

t=user   User taps Open Invitation.
         CurtainReveal mounts as fixed overlay.
         Two SVG curtain panels slide on screen from off-canvas (x: 0 → ±100%).
         Settle 0.4s, hold 0.3s, then split apart (x: 0 → -110% / +110%) over
         2.5s with ease "power3.inOut".
         Overlay fades out (opacity 1→0) on completion.

t=+2s    Page auto-scrolls to ScratchReveal section (smooth, 1.2s).

scratch  As user drags, canvas erases circular strokes (radius 28px, soft edge).
         Progress sampled on pointerup. At >=60% scratched:
           - remaining gold animates to opacity 0 (0.6s)
           - date scales 0.94 → 1.0 with spring
           - confetti.fire() — wine, gold, white, ~120 particles
           - sparkle layer (12 SVG stars) fades + drifts up
           - soft glow (radial wine 6%) pulses once
         Then "We're Getting Married" fades in (delay 1.2s).

t=+3s    Auto-scroll to CountdownSection.
         Cards stagger-fade-in. Digits update each second with a 0.3s
         y-flip on change.
```

## 5. Recreation Plan

1. Scaffold Next.js 15 App Router + TS + Tailwind.
2. Wire Cormorant Garamond + Playfair Display via `next/font/google`.
3. Implement design tokens in `tailwind.config.ts`
   (colors: wine #8B1E1E, gold #D4AF37, ink #222222; fonts).
4. Build `LuxuryButton`, `DecorativeDivider`, `VillaCrest` primitives.
5. Build `HeroReveal` with Framer Motion entrance.
6. Build `CurtainReveal` with two SVG panels animated via GSAP timeline,
   exposed as a promise the page awaits before scrolling.
7. Build `ScratchReveal` with a custom `<canvas>` overlay painted with a
   radial gold gradient + diagonal sheen lines (the "metallic" look),
   pointer event handlers that erase using `globalCompositeOperation =
   'destination-out'`, and a sampling pass that computes alpha coverage on
   `pointerup` to detect the 60% threshold.
8. Build `CountdownSection` with a `useCountdown` hook targeting
   2027-09-10T00:00:00 and AnimatePresence on each digit.
9. Build `MusicPlayer` — a fixed bottom-right circular button toggling an
   `<audio>` tag; default muted; subtle wine ring border.
10. Page orchestration in `app/page.tsx`: three sections stacked, programmatic
    smooth scroll between them after each act resolves.
11. Mobile QA at 390x844; keep all hit-targets >=44px.
12. Deploy to Vercel; document install + deploy steps in README.
