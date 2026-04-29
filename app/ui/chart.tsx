'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import type { StatsPoint } from '@/app/types';

interface ChartProps {
  data: StatsPoint[];
}

export function SignupChart({ data }: ChartProps) {
  return (
    <div className="h-64 rounded-3xl border border-border bg-card p-4 flex flex-col">
      <h3 className="mb-4 text-lg font-semibold shrink-0">Signup activity</h3>
      <div className="flex-grow min-w-0 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, bottom: 5, left: 0, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip labelStyle={{ color: 'var(--foreground)' }} contentStyle={{ background: 'var(--card)', borderRadius: 16, border: '1px solid rgba(148,163,184,0.2)' }} />
            <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="rgba(79,70,229,0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
