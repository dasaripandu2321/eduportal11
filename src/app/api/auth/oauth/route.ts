import { NextRequest, NextResponse } from 'next/server';
import {
  findUserByEmail, readUsers, toPublic,
  signToken, COOKIE_NAME, cookieOptions,
} from '@/lib/auth-server';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, photoUrl, provider } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Find or create user (no password for OAuth users)
    let stored = findUserByEmail(email);

    if (!stored) {
      const users = readUsers();
      const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      stored = {
        id,
        email: email.toLowerCase(),
        displayName: displayName || email.split('@')[0],
        passwordHash: `oauth:${provider}`, // not a real hash — OAuth users can't use password login
        userType: 'student',
        createdAt: new Date().toISOString(),
        photoUrl: photoUrl || undefined,
      };
      users.push(stored);
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }

    const token = signToken(stored.id);
    const user = toPublic(stored);

    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, cookieOptions(60 * 60 * 24 * 7));
    return res;
  } catch (err) {
    console.error('OAuth error:', err);
    return NextResponse.json({ error: 'OAuth sign-in failed.' }, { status: 500 });
  }
}
