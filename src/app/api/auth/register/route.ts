import { NextRequest, NextResponse } from 'next/server';
import { createUser, signToken, COOKIE_NAME, cookieOptions } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await createUser(email.trim(), password, displayName?.trim());
    const token = signToken(user.id);

    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, cookieOptions(60 * 60 * 24 * 7)); // 7 days
    return res;
  } catch (err: any) {
    if (err.message === 'EMAIL_IN_USE') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
