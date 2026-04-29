import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireAdmin } from '@/app/utils/auth';
import { toolSchema } from '@/app/utils/validators';

export async function GET() {
  const tools = await prisma.tool.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json({ tools });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = toolSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const tool = await prisma.tool.create({ data: validation.data });
  return NextResponse.json({ tool }, { status: 201 });
}
