// Small presentational helpers shared across cards / detail pages.

const ACCENT_PALETTE = [
  "#C6FF3A",
  "#6EE7F9",
  "#A78BFA",
  "#FB7185",
  "#FBBF24",
  "#34D399",
  "#F472B6",
  "#60A5FA",
];

/** Deterministic accent color from a stable seed (e.g. an id), for gradients/dots. */
export function accentColor(seed: string | undefined | null): string {
  if (!seed) return ACCENT_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}

/** Year string from a release / expected-release timestamp (ms), or empty. */
export function yearOf(
  releaseTime?: number | null,
  expectedReleaseTime?: number | null
): string {
  const ts = releaseTime ?? expectedReleaseTime;
  if (!ts) return "";
  const y = new Date(ts).getFullYear();
  return Number.isFinite(y) ? String(y) : "";
}
