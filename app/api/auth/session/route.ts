import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/app/utils/auth';

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie');
  const match = cookie?.match(/portfolio_session=([^;]+)/);
  const token = match?.[1] ?? null;

  if (!token) {
    return NextResponse.json({ session: null });
  }

  const session = verifySessionToken(token);
  return NextResponse.json({ session });
}
