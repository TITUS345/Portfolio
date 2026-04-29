'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for client-side navigation
import axios from 'axios';
import { ArrowRight, Mail, Lock, User, Home, Menu } from 'lucide-react'; // Add Home and Menu icon
import { motion } from 'framer-motion';
import { Sheet } from '@/app/ui/sheet';
import { Button } from '@/app/ui/button';
import { Input } from '@/app/ui/input';
import { useSidebar } from '@/components/sidebar-provider';


export default function SiteHeader() {
  const { toggle } = useSidebar();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupVerificationCode, setSignupVerificationCode] = useState('');
  const [requiresSignupVerification, setRequiresSignupVerification] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/auth/login', { email: loginEmail, password: loginPassword });
      // If successful, the server sets the session cookie, so we can redirect
      window.location.assign('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!requiresSignupVerification) {
        const response = await axios.post('/api/auth/signup', { 
          name: signupName, 
          email: signupEmail, 
          password: signupPassword 
        });
        if (response.data.requiresVerification) {
          setRequiresSignupVerification(true);
          setError(null); // Clear previous errors if any
        }
      } else {
        // This is the verification step after signup
        await axios.post('/api/auth/verify', { 
          email: signupEmail, 
          code: signupVerificationCode 
        });
        window.location.assign('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
      if (requiresSignupVerification) {
        setError(err.response?.data?.error || 'Invalid verification code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-gray-200/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between relative">
      {/* Logo and Title */}
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">My Fullstack Developer Portfolio</p>
        <div 
          className="flex items-center gap-2 text-lg font-semibold text-blue-700 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <motion.span
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            whileHover={{ scale: 0.9, rotate: 360 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}>
            <Home size={20} />
          </motion.span>
          <span>Titus Tarus</span>
        </div>
      </div>
      
      {/* Action buttons including the mobile menu toggle */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
        {/* Mobile Menu Toggle - now placed before Sign in button */}
        <Button
          variant="ghost"
          className="lg:hidden p-2 rounded-2xl hover:bg-muted"
          onClick={toggle}
        >
          <Menu size={24} className="text-blue-700" />
        </Button>
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="rounded-full border border-border px-4 py-2 hover:border-primary hover:text-primary transition-all"
        >
          Sign in
        </button>
        <button 
          onClick={() => setIsSignupOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-all"
        >
          Start
          <ArrowRight size={16} />
        </button>
      </div>
      </div>

      {/* Login Sheet */}
      <Sheet isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Welcome back">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4 text-gray-800">
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input 
                  className="pl-10" type="email" placeholder="name@example.com" required
                  value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input 
                  className="pl-10" type="password" placeholder="••••••••" required
                  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} className="font-semibold text-primary hover:underline">
              Create one
            </button>
          </p>
        </form>
      </Sheet>

      {/* Signup Sheet */}
      <Sheet isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} title="Start the journey">
        {requiresSignupVerification ? (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4 text-gray-800">
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <p className="text-sm text-gray-600">A 6-digit verification code has been sent to {signupEmail}. Please enter it below.</p>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Verification Code</label>
                <div className="relative">
                  <Input 
                    className="pl-3" type="text" placeholder="123456" required
                    value={signupVerificationCode} onChange={(e) => setSignupVerificationCode(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4 text-gray-800">
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input 
                    className="pl-10" placeholder="Titus Tarus" required
                    value={signupName} onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input 
                    className="pl-10" type="email" placeholder="name@example.com" required
                    value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input 
                    className="pl-10" type="password" placeholder="••••••••" required
                    value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Get Started'}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} className="font-semibold text-primary hover:underline">
                Sign in
              </button>
            </p>
          </form>
        )}
      </Sheet>
    </header>
  );
}
