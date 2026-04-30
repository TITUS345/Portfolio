'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface PasswordResetPageProps {
  onClose?: () => void; // Optional callback to close the dialog
}

export default function PasswordResetPage({ onClose }: PasswordResetPageProps) {
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetStates = () => {
    setLoading(true);
    setError(null);
  };

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    resetStates();
    try {
      await axios.post('/api/auth/request-password-reset', { email });
      setStep('code');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to send code.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    resetStates();
    try {
      await axios.post('/api/auth/request-password-reset', { email, code, action: 'verify' });
      setStep('password');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Invalid code.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    resetStates();
    try {
      await axios.put('/api/auth/request-password-reset', { email, token: code, newPassword });
      setStep('success');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to reset password.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      {step === 'success' ? (
        <div className="text-center space-y-4 py-6">
          <h2 className="text-xl font-bold text-green-600">Success!</h2>
          <p className="text-sm text-gray-600">Your password has been reset successfully.</p>
          <Button className="w-full" onClick={onClose}>Back to Login</Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-blue-700 mb-2">
            {step === 'email' && "Reset Your Password"}
            {step === 'code' && "Verify Your Email"}
            {step === 'password' && "Set New Password"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {step === 'email' && "Enter your email address to receive a verification code."}
            {step === 'code' && `We sent a 6-digit code to ${email}`}
            {step === 'password' && "Create a secure new password for your account."}
          </p>

          <form 
            onSubmit={
              step === 'email' ? handleRequestCode : 
              step === 'code' ? handleVerifyCode : 
              handleResetPassword
            } 
            className="grid gap-4"
          >
            {step === 'email' && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required autoFocus />
              </div>
            )}

            {step === 'code' && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Verification Code</label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} type="text" placeholder="6-digit code" required autoFocus />
              </div>
            )}

            {step === 'password' && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" required autoFocus />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : step === 'email' ? 'Send Code' : step === 'code' ? 'Verify Code' : 'Update Password'}
            </Button>

            {onClose && (
              <button type="button" onClick={onClose} className="text-xs text-center text-gray-500 hover:text-blue-600 underline mt-2">
                Back to login
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
}