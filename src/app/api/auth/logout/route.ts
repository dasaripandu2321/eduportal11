import { NextResponse } from 'next/server';
import { COOKIE_NAME, cookieOptions } from '@/lib/auth-server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, '', cookieOptions(0));
  return res;
}
