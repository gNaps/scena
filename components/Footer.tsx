import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 py-9 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="font-sans font-extrabold text-[18px] text-foreground"
        >
          SCENA<span className="text-primary">.</span>
        </Link>
        <div className="flex items-center gap-6 font-mono text-[11px] text-text-dim">
          <span>
            &copy; {new Date().getFullYear()} Scena &middot; La scena videoludica
            italiana
          </span>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors uppercase tracking-[0.06em]"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
