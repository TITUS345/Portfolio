'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import SiteHeader from '../../../components/site-header';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/signup', { email, password, name, adminSecret });
      router.push('/dashboard');
    } catch {
      setError('Unable to register. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Create account</p>
          <h1 className="text-3xl font-bold">Start managing your portfolio content.</h1>
          <p className="text-sm text-muted">Sign up for admin access to edit landing content, tool listings, and user analytics.</p>
        </div>
        <form className="grid gap-5 rounded-[2rem] border border-border bg-card p-8 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Your name" required />
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-medium">Email</label>
            <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-medium">Password</label>
            <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Minimum 8 characters" required />
          </div>
          <div className="grid gap-3">
            <label className="text-sm font-medium">Admin secret (optional)</label>
            <Input value={adminSecret} onChange={(event) => setAdminSecret(event.target.value)} type="password" placeholder="Admin secret key" />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Sign up'}</Button>
        </form>
      </main>
    </div>
  );
}
