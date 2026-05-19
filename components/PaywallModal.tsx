'use client';
import { useState } from 'react';

interface Props {
  docName: string;
  docId: string;
  onClose: () => void;
  onSuccess: (plan: string) => void;
}

const PLANS = [
  {
    id: 'once',
    name: 'Once-off Export',
    price: 'R50',
    period: 'this document only',
    icon: '📄',
    color: '#64748b',
    features: ['✓ Download this document', '✓ Print / Save as PDF', '✗ No subscription'],
    cta: 'Pay R50',
  },
  {
    id: 'student',
    name: 'Student',
    price: 'R35',
    period: '/month',
    icon: '🎓',
    color: '#3b82f6',
    badge: 'POPULAR',
    features: [
      '✓ Unlimited AI enhancements',
      '✓ Unlimited PDF exports',
      '✓ All document types',
      '✓ CV & cover letter',
      '✓ Cancel anytime',
    ],
    cta: 'Start Student Plan',
  },
  {
    id: 'business',
    name: 'Business',
    price: 'R99',
    period: '/month',
    icon: '🏢',
    color: '#B8860B',
    badge: 'BEST VALUE',
    features: [
      '✓ Everything in Student',
      '✓ All 8 business documents',
      '✓ Lease, NDA, Employment',
      '✓ Deed of Sale',
      '✓ Priority AI responses',
      '✓ Cancel anytime',
    ],
    cta: 'Start Business Plan',
  },
];

export default function PaywallModal({ docName, docId, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePay = async (planId: string) => {
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setError('');
    setLoading(planId);

    try {
      const plan = planId === 'business' ? 'unlimited' : planId === 'student' ? 'student' : 'once';
      const res = await fetch('/api/payfast/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          documentId: docId,
          documentName: docName,
          buyerName: name,
          buyerEmail: email,
        }),
      });

      if (!res.ok) throw new Error('Could not generate payment URL');
      const { url } = await res.json();

      // Store pending plan so success page can record it
      sessionStorage.setItem('formcraft_pending_plan', plan);
      sessionStorage.setItem('formcraft_pending_docId', docId);

      window.location.href = url;
    } catch {
      setError('Payment unavailable. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0A1628] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-xl">Unlock Your Document</h2>
            <p className="text-slate-400 text-sm mt-1">Choose a plan to download <strong className="text-white">{docName}</strong></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Name + Email */}
        <div className="px-6 pt-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1 block">Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B]"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1 block">Email for Receipt</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B]"
            />
          </div>
        </div>
        {error && <p className="px-6 text-red-400 text-sm">{error}</p>}

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className="relative rounded-xl border p-5 flex flex-col gap-4"
              style={{ borderColor: plan.color + '66', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              {plan.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full"
                  style={{ backgroundColor: plan.color, color: '#0A1628' }}
                >
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{plan.icon}</span>
                <div>
                  <div className="text-white font-bold text-sm">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-black text-xl" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-slate-500 text-xs">{plan.period}</span>
                  </div>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={`text-xs ${f.startsWith('✗') ? 'text-slate-600' : 'text-slate-300'}`}>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handlePay(plan.id)}
                disabled={loading === plan.id}
                className="w-full py-2.5 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: plan.color, color: '#0A1628' }}
              >
                {loading === plan.id ? 'Redirecting…' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs pb-5">
          🔒 Secure payments via PayFast · Cancel anytime · SA pricing
        </p>
      </div>
    </div>
  );
}
