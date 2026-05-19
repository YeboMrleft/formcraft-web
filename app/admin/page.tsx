'use client';
import { useState } from 'react';

interface Payment {
  id: string;
  userEmail: string;
  plan: string;
  planLabel: string;
  amount: number;
  documentId: string | null;
  createdAt: string | null;
  app: string;
}

interface Stats {
  totalRevenue: number;
  totalPayments: number;
  activeSubscriptions: number;
  uniqueCustomers: number;
  thisMonthRevenue: number;
  monthlyRevenue: Record<string, number>;
  planBreakdown: Record<string, number>;
  payments: Payment[];
}

const PLAN_COLORS: Record<string, string> = {
  'Once-off': '#64748b',
  'Student': '#3b82f6',
  'Business': '#B8860B',
};

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function MonthlyChart({ data }: { data: Record<string, number> }) {
  const months = Object.keys(data).sort().slice(-6);
  if (!months.length) return <p className="text-slate-500 text-sm text-center py-4">No revenue data yet.</p>;
  const max = Math.max(...months.map(m => data[m]));

  return (
    <div className="flex items-end gap-2 h-32">
      {months.map(m => {
        const pct = max > 0 ? (data[m] / max) * 100 : 0;
        const label = new Date(m + '-01').toLocaleDateString('en-ZA', { month: 'short', year: '2-digit' });
        return (
          <div key={m} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-slate-400">R{data[m].toFixed(0)}</span>
            <div className="w-full rounded-t-sm bg-[#B8860B]/80" style={{ height: `${Math.max(pct, 4)}%` }} />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) { setError('Incorrect password.'); setLoading(false); return; }
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setStats(data);
    } catch {
      setError('Failed to load data. Check server configuration.');
    }
    setLoading(false);
  };

  const filtered = stats?.payments.filter(p =>
    !search || p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
    p.planLabel.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">🔐</div>
            <h1 className="text-white font-bold text-xl">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">FormCraft Revenue & Subscriptions</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B]"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="bg-[#B8860B] hover:bg-[#a07609] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {loading ? 'Loading…' : 'View Dashboard →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-bold text-2xl">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">FormCraft · Revenue & Subscriptions</p>
          </div>
          <button onClick={() => setStats(null)} className="text-slate-500 hover:text-slate-300 text-sm">
            Log out
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `R${stats.totalRevenue.toFixed(2)}`, color: '#B8860B' },
            { label: 'This Month', value: `R${stats.thisMonthRevenue.toFixed(2)}`, color: '#22c55e' },
            { label: 'Active Subs', value: stats.activeSubscriptions.toString(), color: '#3b82f6' },
            { label: 'Customers', value: stats.uniqueCustomers.toString(), color: '#a855f7' },
            { label: 'Total Payments', value: stats.totalPayments.toString(), color: '#64748b' },
          ].map(card => (
            <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">{card.label}</p>
              <p className="font-black text-xl" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Monthly revenue */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Monthly Revenue (ZAR)</h2>
            <MonthlyChart data={stats.monthlyRevenue} />
          </div>

          {/* Plan breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Plan Breakdown</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(stats.planBreakdown).map(([plan, count]) => {
                const pct = stats.totalPayments > 0 ? Math.round((count / stats.totalPayments) * 100) : 0;
                return (
                  <div key={plan}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{plan}</span>
                      <span className="text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: PLAN_COLORS[plan] ?? '#64748b' }} />
                    </div>
                  </div>
                );
              })}
              {!Object.keys(stats.planBreakdown).length && (
                <p className="text-slate-500 text-sm">No payments yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Payments table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-white font-semibold text-sm">Recent Payments</h2>
            <input
              type="text"
              placeholder="Search email or plan…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#B8860B] w-48"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wide border-b border-white/10">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Plan</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3">App</th>
                  <th className="text-left px-5 py-3">Document</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3 text-white font-medium">{p.userEmail || '—'}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: (PLAN_COLORS[p.planLabel] ?? '#64748b') + '33', color: PLAN_COLORS[p.planLabel] ?? '#94a3b8' }}>
                        {p.planLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-emerald-400 font-semibold">R{p.amount.toFixed(2)}</td>
                    <td className="px-5 py-3 text-slate-400">{p.app}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{p.documentId ?? '—'}</td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                      {search ? 'No results match your search.' : 'No payments yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <p className="px-5 py-3 text-slate-500 text-xs border-t border-white/10">
              Showing {filtered.length} of {stats.payments.length} payment{stats.payments.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
