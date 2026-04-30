'use client';

import Link from 'next/link';
import { Home, BarChart3, ShieldCheck, UserPlus } from 'lucide-react';
import { useSidebar } from '@/components/sidebar-provider';
import { Sheet } from '@/app/ui/sheet';

export default function SiteSidebar() {
  const { isOpen, setIsOpen } = useSidebar();

  const NavLinks = () => (
    <div className="space-y-2">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm hover:bg-muted text-blue-500 hover:text-foreground">
        <Home size={18} />
        Overview
      </Link>
      <Link href="/dashboard/admin" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm hover:bg-muted text-blue-500 hover:text-foreground">
        <ShieldCheck size={18} />
        Admin panel
      </Link>
      <Link href="/auth/login" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm hover:bg-muted text-blue-500 hover:text-foreground">
        <UserPlus size={18} />
        Sign in
      </Link>
      <Link href="/auth/signup" className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm hover:bg-muted text-blue-500 hover:text-foreground">
        <BarChart3 size={18} />
        Sign up
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 rounded-[2rem] border border-border bg-card p-6 lg:block">
        <div className="mb-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Dashboard</p>
          <NavLinks />
        </div>
        <div className="mt-auto rounded-3xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tips</p>
          <p className="mt-2">Dashboard to manage the portfolio content, guest users, and landing sections with API-driven data.</p>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Menu">
          <div className="space-y-6 mt-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl">
            <NavLinks />
            <div className="rounded-3xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Tips</p>
              <p className="mt-2">Dashboard to manage the portfolio content, guest users, and landing sections.</p>
            </div>
          </div>
        </Sheet>
      </div>
    </>
  );
}
