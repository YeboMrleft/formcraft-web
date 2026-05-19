import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { docType, fields } = await req.json();

    const filledFields = Object.entries(fields as Record<string, string>)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are helping generate a professional South African ${docType}.
The user has filled in these fields:
${filledFields}

Return a JSON object with enhanced versions of the TEXT fields (not dates, numbers, or selects).
Improve grammar, professionalism, and completeness of text fields like descriptions, job duties,
profile summaries, and clause text. Keep the SAME field keys. Only include fields you improved.
Respond with only valid JSON, no markdown.`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';
    let enhanced: Record<string, string> = {};
    try {
      enhanced = JSON.parse(raw);
    } catch {
      enhanced = {};
    }

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error('Enhance error:', error);
    return NextResponse.json({ error: 'Enhancement failed' }, { status: 500 });
  }
}
