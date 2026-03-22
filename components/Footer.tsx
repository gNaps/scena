import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/7 px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
            SCENE
          </span>
          . Tutti i diritti riservati.
        </p>
        <nav className="flex gap-6">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookie" className="hover:text-foreground transition-colors">
            Cookie Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
