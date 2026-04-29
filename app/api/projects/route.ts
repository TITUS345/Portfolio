import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest, requireAdmin } from '@/app/utils/auth';
import { projectSchema } from '@/app/utils/validators';

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { featured: 'desc' } });
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  try {
    requireAdmin(session);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const project = await prisma.project.create({ data: validation.data });
  return NextResponse.json({ project }, { status: 201 });
}
