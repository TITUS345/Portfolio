// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSessionCookie } from '@/app/utils/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, code } = body;

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.verificationCode !== code) {
    return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
  }

  // Mark user as verified and clear the code
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationCode: null,
    },
  });

  // Create session and set cookie
  const sessionPayload = { id: user.id, email: user.email, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }; // 7 days
  const sessionToken = createSessionCookie(sessionPayload);
  const cookieStore = await cookies();
  cookieStore.set('portfolio_session', sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' });

  return NextResponse.json({ success: true });
}