// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signupSchema } from '@/app/utils/validators';
import { Role } from '@/app/types'; // Import Role from your types file
import { hashPassword } from '@/app/utils/auth';
import { sendAdminNotification, sendVerificationEmail } from '@/app/mailer';
import crypto from 'crypto';
import { authRateLimiter, getIP } from '@/app/utils/rate-limiter';

export async function POST(request: NextRequest) {
  // 1. Check Rate Limit
  const identifier = getIP(request);
  const { success } = await authRateLimiter.limit(
    `ratelimit_signup_${identifier}`
  );

  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, name, adminSecret } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
  }

  const hashedPassword = hashPassword(password);

  let role: Role = 'USER';
  if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
    role = 'ADMIN';
  }

  // Generate 6-digit code for email verification
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      role,
      verificationCode, // Save the verification code
      emailVerified: false, // Mark as not verified initially
    },
  });

  // Send verification email
  await sendVerificationEmail(user.email, verificationCode);

  // Send admin notification for new signup
  await sendAdminNotification(user.email);

  // Site event creation is omitted here for brevity, but you might want to add it.

  return NextResponse.json({ requiresVerification: true, email: user.email }, { status: 201 });
}