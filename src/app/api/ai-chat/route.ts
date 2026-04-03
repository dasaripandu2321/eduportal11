import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
    }

    const systemInstruction = `You are an expert programming tutor and doubt-clearing assistant for Edu Portal.
Your role is to help students understand programming concepts, debug code, and clarify doubts.
${context ? `The student is currently studying: ${context}.` : ''}
Guidelines:
- Give clear, concise explanations with practical examples
- Use code blocks with triple backticks for code examples
- Break down complex concepts into simple steps
- Be encouraging and supportive
- Keep responses focused and practical`;

    // Build Gemini contents array
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const body = {
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: 'Gemini API error.' }, { status: 500 });
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
