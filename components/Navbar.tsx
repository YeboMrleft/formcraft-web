'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0A1628] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#B8860B] font-bold text-xl tracking-tight">FormCraft</span>
          <span className="text-white/40 text-sm font-light hidden sm:inline">· AI Documents</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            Documents
          </Link>
          <a
            href="https://philasandenxele.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors"
          >
            Portfolio
          </a>
          <a
            href="https://formcraft-ai-39547.web.app"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#B8860B] hover:bg-[#a07609] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          >
            Get the App
          </a>
        </div>
      </div>
    </nav>
  );
}
