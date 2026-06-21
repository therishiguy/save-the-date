export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function smoothScrollTo(id: string, offset = 0): void {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
