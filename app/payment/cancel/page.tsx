import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">↩️</div>
        <h1 className="text-white text-2xl font-bold mb-2">Payment Cancelled</h1>
        <p className="text-slate-400 mb-6">
          No worries — your document has been saved. You can try again whenever you&apos;re ready.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/preview"
            className="bg-[#B8860B] hover:bg-[#a07609] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Preview
          </Link>
          <Link
            href="/"
            className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            ← Start a new document
          </Link>
        </div>
      </div>
    </div>
  );
}
