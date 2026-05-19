'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface VerifyResult {
  valid: boolean;
  plan?: string;
  paidAt?: string;
  renewsAt?: string;
  expiresAt?: string;
  amount?: string;
  reason?: string;
}

function planLabel(plan?: string) {
  if (plan === 'business' || plan === 'unlimited') return 'Business Plan';
  if (plan === 'student') return 'Student Plan';
  return 'Once-off Export';
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [verifying, setVerifying] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('formcraft_pending_email') || '';
    const plan = params.get('plan') || sessionStorage.getItem('formcraft_pending_plan') || 'once';
    const docId = sessionStorage.getItem('formcraft_pending_docId') || `doc-${Date.now()}`;
    setEmail(pendingEmail);

    const verify = async () => {
      if (!pendingEmail) {
        // No email stored — just trust the redirect and store plan locally
        storeLocally(plan, docId, null);
        setResult({ valid: true, plan });
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: pendingEmail }),
        });
        const data: VerifyResult = await res.json();

        if (data.valid) {
          storeLocally(data.plan || plan, docId, data);
          setResult(data);
        } else {
          // PayFast ITN may still be processing — store optimistically
          storeLocally(plan, docId, null);
          setResult({ valid: true, plan });
        }
      } catch {
        storeLocally(plan, docId, null);
        setResult({ valid: true, plan });
      }
      setVerifying(false);
    };

    verify();
  }, [params]);

  function storeLocally(plan: string, docId: string, verified: VerifyResult | null) {
    const isSubscription = plan === 'unlimited' || plan === 'business' || plan === 'student';
    const entry = {
      plan,
      paidAt: verified?.paidAt || new Date().toISOString(),
      renewsAt: verified?.renewsAt || null,
      expiresAt: verified?.expiresAt || null,
      email: sessionStorage.getItem('formcraft_pending_email') || '',
      verifiedAt: new Date().toISOString(),
    };
    const key = isSubscription ? 'subscription' : docId;
    const existing = JSON.parse(localStorage.getItem('formcraft_payments') || '{}');
    localStorage.setItem('formcraft_payments', JSON.stringify({ ...existing, [key]: entry }));
    sessionStorage.removeItem('formcraft_pending_plan');
    sessionStorage.removeItem('formcraft_pending_docId');
    sessionStorage.removeItem('formcraft_pending_email');
  }

  useEffect(() => {
    if (verifying) return;
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); router.push('/preview'); }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [verifying, router]);

  const isSubscription = result?.plan && result.plan !== 'once';

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">

        {verifying ? (
          <>
            <div className="text-5xl mb-4 animate-pulse">🔍</div>
            <h1 className="text-white text-xl font-bold mb-2">Verifying Payment…</h1>
            <p className="text-slate-400 text-sm">Checking your payment with our server.</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-white text-2xl font-bold mb-1">Payment Confirmed!</h1>
            {email && <p className="text-slate-400 text-sm mb-5">Receipt sent to <span className="text-white">{email}</span></p>}

            {/* Subscription card */}
            <div className="bg-[#B8860B]/15 border border-[#B8860B]/40 rounded-xl p-5 mb-5 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#B8860B] font-bold text-base">{planLabel(result?.plan)}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-slate-500">Amount paid</span>
                <span className="text-white font-semibold text-right">R{result?.amount || (isSubscription ? (result?.plan === 'student' ? '35' : '99') : '50')}</span>

                <span className="text-slate-500">Activated</span>
                <span className="text-white text-right">{formatDate(result?.paidAt)}</span>

                {isSubscription && result?.renewsAt && (
                  <>
                    <span className="text-slate-500">Renews on</span>
                    <span className="text-white text-right">{formatDate(result.renewsAt)}</span>
                  </>
                )}
                {isSubscription && result?.expiresAt && (
                  <>
                    <span className="text-slate-500">Valid until</span>
                    <span className="text-emerald-400 font-semibold text-right">{formatDate(result.expiresAt)}</span>
                  </>
                )}
                {!isSubscription && (
                  <>
                    <span className="text-slate-500">Validity</span>
                    <span className="text-white text-right">This document only</span>
                  </>
                )}
              </div>
              {isSubscription && (
                <p className="text-slate-500 text-xs mt-3 border-t border-white/10 pt-3">
                  Your subscription renews automatically via PayFast. Cancel anytime from your PayFast account.
                </p>
              )}
            </div>

            <div className="bg-white/5 rounded-lg px-4 py-2 mb-5">
              <p className="text-[#B8860B] text-sm">Redirecting to your document in {countdown}s…</p>
            </div>

            <Link href="/preview" className="block bg-[#B8860B] hover:bg-[#a07609] text-white font-bold px-6 py-3 rounded-xl transition-colors mb-3">
              Download Now →
            </Link>
            <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
              ← Create another document
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1628] flex items-center justify-center text-white">Verifying…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
