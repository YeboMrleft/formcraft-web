'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const plan = params.get('plan') || sessionStorage.getItem('formcraft_pending_plan') || 'once';
    const docId = params.get('docId') || sessionStorage.getItem('formcraft_pending_docId') || 'unknown';
    const pid = params.get('pid') || '';

    // Record payment in localStorage
    const payments = JSON.parse(localStorage.getItem('formcraft_payments') || '{}');
    if (plan === 'unlimited' || plan === 'business' || plan === 'student') {
      payments['subscription'] = { plan, pid, paidAt: new Date().toISOString() };
    } else {
      payments[docId] = { plan: 'once', pid, paidAt: new Date().toISOString() };
    }
    localStorage.setItem('formcraft_payments', JSON.stringify(payments));

    sessionStorage.removeItem('formcraft_pending_plan');
    sessionStorage.removeItem('formcraft_pending_docId');

    // Auto-redirect back to preview
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          router.push('/preview');
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-white text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-slate-400 mb-6">
          Thank you for your payment. Your document is now ready to download.
        </p>
        <div className="bg-[#B8860B]/20 border border-[#B8860B]/40 rounded-xl p-4 mb-6">
          <p className="text-[#B8860B] text-sm font-semibold">
            Redirecting to your document in {countdown}s…
          </p>
        </div>
        <Link
          href="/preview"
          className="inline-block bg-[#B8860B] hover:bg-[#a07609] text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Download Now →
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            ← Back to documents
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
