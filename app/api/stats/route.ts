import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const totalUsers = await prisma.user.count();
  const totalSignups = await prisma.siteEvent.count({ where: { type: 'SIGNUP' } });
  const rawSignupData = await prisma.siteEvent.groupBy({
    by: ['createdAt'],
    where: { type: 'SIGNUP' },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });

  const signupChart = rawSignupData
    .map((item: { createdAt: Date }) => ({
      date: item.createdAt.toISOString().slice(0, 10),
      count: 1,
    }))
    .reduce((acc: Record<string, number>, data: { date: string; count: number }) => {
      acc[data.date] = (acc[data.date] ?? 0) + 1;
      return acc;
    }, {});

  const signupChartPoints = Object.entries(signupChart)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return NextResponse.json({ totalUsers, totalSignups, signupChart: signupChartPoints });
}
