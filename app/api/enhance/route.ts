import { NextRequest, NextResponse } from 'next/server';

const PROXY_BASE = 'https://formcraft-ai-39547.web.app';

export async function POST(req: NextRequest) {
  try {
    const { docType, fields } = await req.json();

    const filledFields = Object.entries(fields as Record<string, string>)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const prompt = `You are helping generate a professional South African ${docType}.
The user has filled in these fields:
${filledFields}

Return a JSON object with enhanced versions of the TEXT fields only (not dates, numbers, or selects).
Improve grammar, professionalism, and completeness. Keep the SAME field keys. Only include fields you improved.
Respond with ONLY valid JSON — no markdown, no explanation.`;

    const res = await fetch(`${PROXY_BASE}/ai/perplexity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!res.ok) throw new Error(`Proxy error: ${res.status}`);

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? '{}';

    let enhanced: Record<string, string> = {};
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      enhanced = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      enhanced = {};
    }

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error('Enhance error:', error);
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
  }
}
