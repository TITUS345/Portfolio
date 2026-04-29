import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireAdmin } from '@/app/utils/auth';
import { landingSchema } from '@/app/utils/validators';

export async function GET() {
  const sections = await prisma.landingSection.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ sections });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = landingSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const section = await prisma.landingSection.create({ data: validation.data });
  return NextResponse.json({ section }, { status: 201 });
}
