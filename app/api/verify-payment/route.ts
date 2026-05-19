import { NextRequest, NextResponse } from 'next/server';

const FIREBASE_BASE = 'https://formcraft-ai-39547.web.app';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ valid: false, error: 'Email required' }, { status: 400 });

    const res = await fetch(`${FIREBASE_BASE}/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });

    if (!res.ok) return NextResponse.json({ valid: false }, { status: 200 });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('verify-payment error:', error);
    return NextResponse.json({ valid: false, error: 'Verification failed' }, { status: 500 });
  }
}
