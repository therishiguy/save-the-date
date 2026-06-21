"use client";

interface Props {
  width?: number;
  color?: string;
  className?: string;
}

export default function VillaCrest({
  width = 96,
  color = "#8B1E1E",
  className,
}: Props) {
  return (
    <svg
      className={className}
      width={width}
      viewBox="0 0 160 90"
      fill="none"
      stroke={color}
      strokeWidth={0.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* main facade */}
      <rect x="40" y="40" width="80" height="40" />
      {/* central tower */}
      <rect x="72" y="22" width="16" height="58" />
      <path d="M68 22 L80 12 L92 22 Z" />
      <line x1="80" y1="12" x2="80" y2="6" />
      <circle cx="80" cy="5" r="1.2" fill={color} />
      {/* side wings roofs */}
      <path d="M36 40 L48 30 L72 40 Z" />
      <path d="M88 40 L112 30 L124 40 Z" />
      {/* windows row 1 */}
      <rect x="46" y="48" width="6" height="8" />
      <rect x="56" y="48" width="6" height="8" />
      <rect x="98" y="48" width="6" height="8" />
      <rect x="108" y="48" width="6" height="8" />
      {/* central window */}
      <rect x="76" y="36" width="8" height="10" />
      {/* base steps */}
      <line x1="32" y1="80" x2="128" y2="80" />
      <line x1="28" y1="84" x2="132" y2="84" />
      {/* cypress trees */}
      <path d="M22 80 Q20 60 22 50 Q24 60 22 80 Z" fill={color} fillOpacity="0.08" />
      <path d="M138 80 Q136 60 138 50 Q140 60 138 80 Z" fill={color} fillOpacity="0.08" />
    </svg>
  );
}
