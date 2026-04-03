import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, findUserById, toPublic, COOKIE_NAME } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const stored = findUserById(payload.sub);
  if (!stored) return NextResponse.json({ user: null });

  return NextResponse.json({ user: toPublic(stored) });
}
