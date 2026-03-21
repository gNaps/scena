import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomeNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#07070f]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
        >
          SCENA
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost">Sign in</Button>
          <Button variant="primary" href="/games">Explore</Button>
        </div>
      </div>
    </header>
  )
}
