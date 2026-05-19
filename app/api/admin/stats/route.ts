import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from '@/lib/firebaseAdmin';

const THIRTY_FIVE_DAYS = 35 * 24 * 60 * 60 * 1000;

const PLAN_LABELS: Record<string, string> = {
  once: 'Once-off',
  student: 'Student',
  business: 'Business',
  unlimited: 'Business',
};

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getFirestore();
    const snap = await db.collection('payments').where('status', '==', 'completed').get();
    const now = Date.now();

    const payments = snap.docs.map(d => {
      const data = d.data();
      const createdMs = data.createdAt?.toMillis?.() ?? null;
      return {
        id: d.id,
        userEmail: data.userEmail ?? '',
        plan: data.plan ?? 'once',
        planLabel: PLAN_LABELS[data.plan] ?? data.plan,
        amount: parseFloat(data.amount ?? '0'),
        documentId: data.documentId ?? null,
        createdAt: createdMs ? new Date(createdMs).toISOString() : null,
        createdMs,
        app: 'FormCraft',
      };
    }).sort((a, b) => (b.createdMs ?? 0) - (a.createdMs ?? 0));

    const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
    const activeSubscriptions = payments.filter(
      p => p.plan !== 'once' && ((now - (p.createdMs ?? 0)) <= THIRTY_FIVE_DAYS)
    ).length;
    const uniqueCustomers = new Set(payments.map(p => p.userEmail).filter(Boolean)).size;

    // Monthly revenue (last 12 months)
    const monthlyRevenue: Record<string, number> = {};
    payments.forEach(p => {
      if (!p.createdMs) return;
      const month = new Date(p.createdMs).toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + p.amount;
    });

    // Plan breakdown
    const planBreakdown: Record<string, number> = {};
    payments.forEach(p => {
      const label = p.planLabel;
      planBreakdown[label] = (planBreakdown[label] ?? 0) + 1;
    });

    // This month revenue
    const thisMonth = new Date().toISOString().slice(0, 7);
    const thisMonthRevenue = monthlyRevenue[thisMonth] ?? 0;

    return NextResponse.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalPayments: payments.length,
      activeSubscriptions,
      uniqueCustomers,
      thisMonthRevenue: Math.round(thisMonthRevenue * 100) / 100,
      monthlyRevenue,
      planBreakdown,
      payments: payments.slice(0, 200).map(({ createdMs: _, ...p }) => p),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('admin/stats error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
