import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireAdmin } from '@/app/utils/auth';
import { contactSchema } from '@/app/utils/validators';

export async function GET() {
  const contacts = await prisma.contact.findMany({ orderBy: { label: 'asc' } });
  return NextResponse.json({ contacts });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = contactSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const contact = await prisma.contact.create({ data: validation.data });
  return NextResponse.json({ contact }, { status: 201 });
}
