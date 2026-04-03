import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, signToken, toPublic, COOKIE_NAME, cookieOptions } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const stored = findUserByEmail(email.trim());
    if (!stored) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, stored.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    const token = signToken(stored.id);
    const user = toPublic(stored);

    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, cookieOptions(60 * 60 * 24 * 7));
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
