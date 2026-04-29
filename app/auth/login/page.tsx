'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import SiteHeader from '../../../components/site-header';
import PasswordResetPage from '../passwordReset/page'; // Import the new component
import * as Dialog from '@radix-ui/react-dialog'; // Import Radix Dialog components

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false); // State for dialog visibility

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (requiresVerification) {
        // Submit the verification code
        await axios.post('/api/auth/verify', { email, code });
        router.push('/dashboard');
      } else {
        // Initial login attempt
        await axios.post('/api/auth/login', { email, password });
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Ensure errorMessage is a string to prevent .toLowerCase() crashes
      const errorData = err.response?.data?.error;
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : 'An error occurred. Please try again.';

      if (!requiresVerification && (errorMessage.toLowerCase().includes('verify') || err.response?.status === 403)) {
        setRequiresVerification(true);
        setError('Verification required. Please enter the code sent to your email.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-gray-600">Log in</p>
          <h1 className="text-3xl font-bold text-blue-700">Access your dashboard</h1>
          <p className="text-sm text-gray-600">Use your account to manage content, review analytics, and keep your portfolio data fresh.</p>
        </div>
        <form className="grid gap-5 rounded-[2rem] border border-gray-400 bg-gray-300 shadow-lg overflow-hidden" onSubmit={handleSubmit}>
          {/* Blue top bar for visual appeal */}
          <div className="h-4 bg-blue-600 rounded-t-[2rem] -mt-px -mx-px shadow-md"></div>
          <div className="p-8 pt-0 grid gap-5">
            {!requiresVerification ? (
              <>
                <div className="grid gap-3">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required />
                </div>
                <div className="grid gap-3">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Your secure password" required />
                </div>
              </>
            ) : (
              <div className="grid gap-3">
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <Input value={code} onChange={(event) => setCode(event.target.value)} type="text" placeholder="Enter 6-digit code" required autoFocus />
              </div>
            )}

            {error ? <p className="text-sm text-destructive font-medium">{error}</p> : null}
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : requiresVerification ? 'Verify & Sign In' : 'Sign in'}
            </Button>

            {requiresVerification && (
              <button type="button" onClick={() => { setRequiresVerification(false); setError(null); }} className="text-xs text-center text-gray-500 hover:text-blue-600 underline">
                Back to login
              </button>
            )}

            {/* Forgot Password / Reset Password Link - Moved inside the form */}
            <Dialog.Root open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="text-xs text-center text-blue-600 hover:underline mt-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent form submission
                    setIsResetPasswordDialogOpen(true);
                  }}
                >
                  Forgot password?
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-50" />
                <Dialog.Content className="z-50 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-xl focus:outline-none">
                  <Dialog.Title className="sr-only">Reset Password</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Enter your email to receive a password reset link.
                  </Dialog.Description>
                  <PasswordResetPage onClose={() => setIsResetPasswordDialogOpen(false)} />
                  <Dialog.Close asChild>
                    <button className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] items-center justify-center rounded-full hover:bg-gray-100" aria-label="Close">
                      ✕
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </form>
      </main>
    </div>
  );
}
