import { accentColor } from "@/lib/display";
import Link from "next/link";

export interface StudioCardData {
  _id: string;
  name: string;
  slug?: string;
  location?: string;
  region?: string;
  description?: string;
  logoUrl?: string | null;
}

export default function StudioCard({
  studio,
  locale,
}: {
  studio: StudioCardData;
  locale: string;
}) {
  const color = accentColor(studio._id);
  const region = studio.region?.replace(/-/g, " ");
  const meta = [studio.location, region].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/${locale}/studios/${studio.slug}`}
      className="group relative block bg-surface border border-border rounded-[3px] p-6 overflow-hidden transition-colors hover:border-border-strong"
    >
      <div
        className="absolute -right-8 -top-8 w-[120px] h-[120px] rounded-full opacity-[0.12]"
        style={{ background: color }}
      />

      <div className="relative flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-full shrink-0 overflow-hidden flex items-center justify-center"
          style={{ background: color }}
        >
          {studio.logoUrl && (
            <img
              src={studio.logoUrl}
              alt={studio.name}
              className="w-full h-full object-cover"
            />
          )}
        </span>
        <span className="min-w-0">
          <span className="block font-sans font-bold text-[20px] leading-tight text-text-strong truncate">
            {studio.name}
          </span>
          {meta && (
            <span className="block font-mono text-[11px] text-muted mt-0.5 capitalize truncate">
              {meta}
            </span>
          )}
        </span>
      </div>

      {studio.description && (
        <p className="relative font-mono text-[13px] leading-[1.6] text-text-2 my-4 line-clamp-3">
          {studio.description}
        </p>
      )}

      {region && (
        <div className="relative flex items-center gap-2">
          <span className="font-mono font-medium text-[10px] tracking-[0.06em] uppercase text-text-2 border border-border-strong px-2 py-1.5 rounded-[2px] capitalize">
            {region}
          </span>
        </div>
      )}
    </Link>
  );
}
