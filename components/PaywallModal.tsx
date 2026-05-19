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
    features: ['✓ Download this document', '✓ Print / Save as PDF', '✗ No subscription required'],
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
      '✓ All business documents',
      '✓ Lease, NDA, Employment',
      '✓ Deed of Sale',
      '✓ Priority AI responses',
      '✓ Cancel anytime',
    ],
    cta: 'Start Business Plan',
  },
];

export default function PaywallModal({ docName, docId, onClose, onSuccess }: Props) {
  const [tab, setTab] = useState<'pay' | 'restore'>('pay');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [restoreEmail, setRestoreEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [error, setError] = useState('');
  const [restoreMsg, setRestoreMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        body: JSON.stringify({ plan, documentId: docId, documentName: docName, buyerName: name, buyerEmail: email }),
      });
      if (!res.ok) throw new Error('Could not generate payment URL');
      const { url } = await res.json();

      sessionStorage.setItem('formcraft_pending_plan', plan);
      sessionStorage.setItem('formcraft_pending_docId', docId);
      sessionStorage.setItem('formcraft_pending_email', email);

      window.location.href = url;
    } catch {
      setError('Payment unavailable. Please try again.');
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    if (!restoreEmail.includes('@')) { setRestoreMsg({ type: 'error', text: 'Enter a valid email address.' }); return; }
    setRestoreLoading(true);
    setRestoreMsg(null);

    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: restoreEmail }),
      });
      const data = await res.json();

      if (!data.valid) {
        setRestoreMsg({ type: 'error', text: 'No active subscription found for this email. Check the email address or contact support.' });
        setRestoreLoading(false);
        return;
      }

      // Store verified subscription in localStorage
      const isSubscription = data.plan !== 'once';
      const entry = {
        plan: data.plan,
        paidAt: data.paidAt,
        renewsAt: data.renewsAt || null,
        expiresAt: data.expiresAt || null,
        email: restoreEmail,
        verifiedAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('formcraft_payments') || '{}');
      const key = isSubscription ? 'subscription' : docId;
      localStorage.setItem('formcraft_payments', JSON.stringify({ ...existing, [key]: entry }));

      const planNames: Record<string, string> = { business: 'Business', unlimited: 'Business', student: 'Student', once: 'Once-off' };
      const renewInfo = data.renewsAt ? ` · Renews ${new Date(data.renewsAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}` : '';
      setRestoreMsg({ type: 'success', text: `✅ ${planNames[data.plan] || 'Plan'} restored successfully!${renewInfo}` });

      setTimeout(() => onSuccess(data.plan), 1500);
    } catch {
      setRestoreMsg({ type: 'error', text: 'Verification failed. Please try again.' });
    }
    setRestoreLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0A1628] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-xl">Unlock Your Document</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Download <strong className="text-white">{docName}</strong>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab('pay')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'pay' ? 'text-[#B8860B] border-b-2 border-[#B8860B]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Choose a Plan
          </button>
          <button
            onClick={() => setTab('restore')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'restore' ? 'text-[#B8860B] border-b-2 border-[#B8860B]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Restore Purchase
          </button>
        </div>

        {tab === 'pay' && (
          <>
            {/* Name + Email */}
            <div className="px-6 pt-5 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1 block">Full Name</label>
                <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B]" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1 block">Email for Receipt</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B]" />
              </div>
            </div>
            {error && <p className="px-6 pb-2 text-red-400 text-sm">{error}</p>}

            {/* Plans */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
              {PLANS.map(plan => (
                <div key={plan.id} className="relative rounded-xl border p-5 flex flex-col gap-4"
                  style={{ borderColor: plan.color + '66', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full"
                      style={{ backgroundColor: plan.color, color: '#0A1628' }}>{plan.badge}</span>
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
                  <button onClick={() => handlePay(plan.id)} disabled={loading === plan.id}
                    className="w-full py-2.5 rounded-lg text-sm font-bold transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: plan.color, color: '#0A1628' }}>
                    {loading === plan.id ? 'Redirecting…' : plan.cta}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-600 text-xs pb-5">🔒 Secure payments via PayFast · Cancel anytime · SA pricing</p>
          </>
        )}

        {tab === 'restore' && (
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <div className="text-4xl">🔑</div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Restore Your Purchase</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Already paid? Enter the email you used during payment to restore access on this device.
              </p>
            </div>
            <div className="w-full max-w-sm">
              <input type="email" placeholder="your.payment@email.com" value={restoreEmail}
                onChange={e => setRestoreEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B] mb-3"
              />
              <button onClick={handleRestore} disabled={restoreLoading}
                className="w-full bg-[#B8860B] hover:bg-[#a07609] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                {restoreLoading ? 'Checking…' : 'Restore Access →'}
              </button>
            </div>
            {restoreMsg && (
              <div className={`w-full max-w-sm rounded-xl px-4 py-3 text-sm font-semibold ${restoreMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {restoreMsg.text}
              </div>
            )}
            <p className="text-slate-600 text-xs">
              Need help? Contact <a href="mailto:mrpnxele@gmail.com" className="text-slate-400 hover:text-white underline">mrpnxele@gmail.com</a>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
