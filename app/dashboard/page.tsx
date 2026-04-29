'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { SignupChart } from '../ui/chart';
import type { AuthSession, DashboardStats } from '@/app/types';
import { LogOut, Users } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // First, try to get the session
        const sessionRes = await axios.get('/api/auth/session');
        const currentSession = sessionRes.data.session;

        if (!currentSession) {
          router.push('/auth/login');
          return;
        }
        setSession(currentSession);

        // Then, try to get the stats
        try {
          const statsRes = await axios.get('/api/stats');
          setStats(statsRes.data);
        } catch (statsError) {
          console.error('Failed to fetch dashboard stats:', statsError);
          setError('Failed to load dashboard statistics. Please try again later.');
          // Even if stats fail, the user might still be logged in, so don't redirect.
        }
      } catch (sessionError) {
        console.error('Failed to fetch session:', sessionError);
        // If session fetch fails, it's a critical error, redirect to login.
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  async function handleSignOut() {
    await axios.post('/api/auth/signout');
    router.push('/auth/login');
  }

  if (loading) {
    return <div className="p-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">User dashboard</p>
          <h1 className="text-3xl font-bold text-blue-700">Welcome back, {session?.name ?? session?.email}</h1>
          <p className="text-sm">The portfolio dashboard summarizes the number of people who have signed in and signup activity across the site.</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2"
          disabled={loading} // Disable sign out button while loading
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">People signed in</p>
          <p className="text-4xl font-semibold">{stats?.totalUsers ?? 0}</p>
          <p className="text-sm ">Total users who have accessed the portfolio.</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Total signups</p>
          <p className="text-4xl font-semibold">{stats?.totalSignups ?? 0}</p>
          <p className="text-sm ">Number of signup events across the site.</p>
        </Card>
        <Card className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Your role</p>
          <p className="text-4xl font-semibold">{session?.role}</p>
          <p className="text-sm ">Signed in users have read-only access unless they are admin.</p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Signup analytics</p>
              <h2 className="text-xl font-semibold text-blue-700">Signup activity this month</h2>
            </div>
            <Users size={24} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!error && stats ? (
            <SignupChart data={stats.signupChart} />
          ) : (
            !error && <p className="text-sm">No analytics data yet.</p>
          )}
        </Card>
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-700">Why this portfolio works</h2>
          <ul className="space-y-3 text-sm">
            <li>API-first content management keeps the site ready for new projects and tools.</li>
            <li>Makes it easy to describe the site's backend, frontend and deployment skills.</li>
            <li>Supports role-based access for admins and read-only users.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
