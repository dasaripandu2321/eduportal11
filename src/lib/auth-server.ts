import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'edu-portal-secret-key-change-in-production';
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  userType: 'student' | 'teacher' | 'admin';
  createdAt: string;
  photoUrl?: string;
}

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  userType: 'student' | 'teacher' | 'admin';
  createdAt: string;
  photoUrl?: string;
}

// ── File-based user store ─────────────────────────────────────────────────────

function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
}

export function readUsers(): StoredUser[] {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): StoredUser | null {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(id: string): StoredUser | null {
  return readUsers().find(u => u.id === id) || null;
}

// ── Password ──────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── User creation ─────────────────────────────────────────────────────────────

export async function createUser(email: string, password: string, displayName?: string): Promise<PublicUser> {
  const users = readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('EMAIL_IN_USE');
  }
  const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    id,
    email: email.toLowerCase(),
    displayName: displayName || email.split('@')[0],
    passwordHash,
    userType: 'student',
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  return toPublic(newUser);
}

// ── JWT ───────────────────────────────────────────────────────────────────────

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

export const COOKIE_NAME = 'edu_auth_token';

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toPublic(u: StoredUser): PublicUser {
  const { passwordHash: _, ...pub } = u;
  return pub;
}
