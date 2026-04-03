import { NextResponse } from 'next/server';
import {
  findUserByEmail, createUser, toPublic,
  signToken, COOKIE_NAME, cookieOptions, readUsers
} from '@/lib/auth-server';

export async function POST() {
  try {
    const email = 'demo@google.com';
    const displayName = 'Google User';

    // Find or create the Google demo user
    let stored = findUserByEmail(email);
    if (!stored) {
      await createUser(email, 'google-oauth-no-password', displayName);
      stored = findUserByEmail(email)!;
    }

    const token = signToken(stored.id);
    const user = toPublic(stored);

    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, cookieOptions(60 * 60 * 24 * 7));
    return res;
  } catch (err) {
    console.error('Google auth error:', err);
    return NextResponse.json({ error: 'Google sign-in failed.' }, { status: 500 });
  }
}
