import { NextRequest, NextResponse, userAgent } from 'next/server';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/app/utils/validators';
import { verifyPassword } from '@/app/utils/auth';
import { createSessionCookie } from '@/app/utils/auth';
import { cookies } from 'next/headers';


export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email address first.' }, { status: 403 });
  }
  

  // Create session and set cookie
  const sessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const sessionToken = createSessionCookie(sessionPayload);
  const cookieStore = await cookies();
  cookieStore.set('portfolio_session', sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7, path: '/' });

  await prisma.siteEvent.create({
    data: {
      type: 'SIGNIN',
      userId: user.id,
      email: user.email,
    },
  });

  return NextResponse.json({ success: true });
}
