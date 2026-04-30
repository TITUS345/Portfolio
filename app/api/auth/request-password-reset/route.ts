import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { hashPassword } from '../../../utils/auth';
import axios from 'axios';

// Helper to send email
async function sendResetEmail(to: string, token: string) {
  const host = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587', 10);
  const user = process.env.EMAIL_USER || process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_PASS || process.env.EMAIL_SERVER_PASSWORD;
  const from = process.env.EMAIL_FROM || user;

  if (!user || !pass) {
    throw new Error('Email credentials (EMAIL_USER and EMAIL_PASS) are missing in .env');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetLink = `${appUrl}/auth/passwordReset?token=${token}&email=${to}`;

  await transporter.sendMail({
     from: from,
    to: to,
    subject: 'Your Password Reset Code',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #1d4ed8;">Reset Your Password</h2>
        <p>You requested a password reset. Please use the following 6-digit code to proceed in the reset wizard:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 20px; background: #f3f4f6; text-align: center; border-radius: 8px; margin: 20px 0; color: #111;">
          ${token}
        </div>
        <p>This code is valid for 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}

// POST: Request a password reset (send email with token)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, action } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'Verification code sent if account exists.' });
    }

    // Handle Verification Step
    if (action === 'verify') {
      if (!user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return NextResponse.json({ error: 'Code expired or invalid.' }, { status: 400 });
      }

      const isCodeValid = await bcrypt.compare(code, user.resetToken);
      if (!isCodeValid) {
        return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: 'Code verified.' });
    }

    // Handle Initial Request Step
    // Generate 6-digit numeric code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Hash the token before storing it in the database
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedResetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });

    await sendResetEmail(email, resetToken);

    return NextResponse.json({ 
      message: 'If an account with that email exists, a verification code has been sent.' 
    });
  } catch (error: unknown) {
    if(axios.isAxiosError(error)) {

    // Log specific details to help debugging
    //console.error('Password Reset Error:', error);
    return NextResponse.json({ error: 'Failed to initiate password reset. Please try again later.' }, { status: 500 });
  }
}

// PUT: Reset password using the token
export async function PUT(request: NextRequest) {
  let body;
  try {
    body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or token.' }, { status: 400 });
    }

    // Check if a reset token exists and is not expired
    if (!user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'Password reset token is invalid or has expired.' }, { status: 400 });
    }

    // Compare the provided token with the hashed token in the database
    const isTokenValid = await bcrypt.compare(token, user.resetToken);

    if (!isTokenValid) {
      return NextResponse.json({ error: 'Invalid email or token.' }, { status: 400 });
    }

    // Use the central hashPassword utility to ensure consistency with the login route
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password and clear the reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    // If we have the email from the already parsed body, invalidate the token
    if (body?.email) {
      await prisma.user.update({
        where: { email: body.email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      }).catch(e => console.error("Failed to clear reset token on error:", e));
    }
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}