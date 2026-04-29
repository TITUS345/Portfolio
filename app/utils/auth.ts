import crypto from 'crypto';
import { NextRequest } from 'next/server';
import type { Role } from '@/app/types';

const COOKIE_NAME = 'portfolio_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  throw new Error('SESSION_SECRET must be defined in environment variables');
}
const SESSION_SECRET = SECRET;
export interface SessionPayload {
  id: string;
  email: string;
  role: Role;
  exp: number;
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, derived] = stored.split(':');
  if (!salt || !derived) return false;
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(computed, 'hex'));
}

export function createSessionCookie(payload: SessionPayload) {
  const encoded = encodePayload(payload);
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = signPayload(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
  if (payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

export function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function requireAdmin(session: SessionPayload | null) {
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}
