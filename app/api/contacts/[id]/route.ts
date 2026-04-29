import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireAdmin } from '@/app/utils/auth';
import { contactSchema } from '@/app/utils/validators';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session= getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = contactSchema.partial().safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const contact = await prisma.contact.update({ where: { id }, data: validation.data });
  return NextResponse.json({ contact });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
