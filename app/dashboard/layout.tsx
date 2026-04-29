import type { Metadata } from 'next';
import SiteSidebar from '@/components/site-sidebar';
import SiteHeader from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Dashboard – Portfolio',
  description: 'User and admin dashboards for the portfolio application.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex flex-col max-w-7xl gap-8 px-6 py-8 min-h-screen">
        <SiteHeader />
        <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <SiteSidebar />
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm shadow-slate-900/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
