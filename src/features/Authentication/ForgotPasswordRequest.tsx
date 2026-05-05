import React, { useState, useRef, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { publicAxios } from '../../../axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../ui/Spinner';

type Step = 'email' | 'code' | 'success';

function ForgotPasswordRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');

  // Step 1 — email
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 — code + new password
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (step !== 'code' || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  // Focus first OTP input when entering code step
  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [step]);

  // ── Step 1: Request code ──────────────────────────────────────────────────
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);
    try {
      await publicAxios.post('/user/reset-password/request', { email });
      setStep('code');
      setTimer(60);
    } catch (err: any) {
      // Always show success to avoid email enumeration
      setStep('code');
      setTimer(60);
    } finally {
      setEmailLoading(false);
    }
  };

  // ── OTP input handlers ────────────────────────────────────────────────────
  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setCodeError('');
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  // ── Resend code ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    setResending(true);
    setCodeError('');
    try {
      await publicAxios.post('/user/reset-password/request', { email });
      setOtp(Array(6).fill(''));
      setTimer(60);
      inputsRef.current[0]?.focus();
    } catch {
      // Silently succeed
      setOtp(Array(6).fill(''));
      setTimer(60);
    } finally {
      setResending(false);
    }
  };

  // ── Step 2: Verify code + set new password ────────────────────────────────
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');

    const code = otp.join('');
    if (code.length < 6) {
      setCodeError('Please enter the complete 6-digit code');
      return;
    }
    if (!newPassword) {
      setCodeError('Please enter a new password');
      return;
    }
    if (newPassword.length < 8) {
      setCodeError('Password must be at least 8 characters');
      return;
    }
    if (!/[a-z]/.test(newPassword)) {
      setCodeError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setCodeError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setCodeError('Password must contain at least one number');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setCodeError('Password must contain at least one special character');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCodeError('Passwords do not match');
      return;
    }

    setCodeLoading(true);
    try {
      await publicAxios.post('/user/reset-password/confirm', {
        token: code,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      setStep('success');
    } catch (err: any) {
      setCodeError(err?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setCodeLoading(false);
    }
  };

  // ── Password strength ─────────────────────────────────────────────────────
  const getStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    const map = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    return { score, label: map[score], color: colors[score] };
  };
  const strength = getStrength();

  // ── Render ────────────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl border border-default shadow-medium text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">Password Reset!</h2>
        <p className="text-sm text-muted mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <button
          onClick={() => navigate('/signin')}
          className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl border border-default shadow-medium">
        <button
          onClick={() => { setStep('email'); setOtp(Array(6).fill('')); setCodeError(''); }}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <h2 className="text-xl font-bold text-primary mb-1">Check your email</h2>
        <p className="text-sm text-muted mb-6">
          We sent a 6-digit code to <span className="font-semibold text-primary">{email}</span>.
          Enter it below along with your new password.
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          {/* OTP inputs */}
          <div>
            <label className="block text-sm font-medium text-primary mb-3">Reset Code</label>
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputsRef.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className={`h-12 w-10 sm:w-12 rounded-xl border text-center text-lg font-bold text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                    codeError
                      ? 'border-red-500 bg-red-500/5'
                      : digit
                      ? 'border-primary-500/60 bg-primary-500/5'
                      : 'border-default bg-default'
                  }`}
                  disabled={codeLoading}
                />
              ))}
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setCodeError(''); }}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-default bg-default text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                disabled={codeLoading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength bar */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4, 5].map((l) => (
                    <div key={l} className={`flex-1 rounded-full transition-colors ${strength.score >= l ? strength.color : 'bg-default'}`} />
                  ))}
                </div>
                <p className={`text-xs ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setCodeError(''); }}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-default bg-default text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                disabled={codeLoading}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {codeError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                {codeError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={codeLoading || otp.join('').length < 6 || !newPassword || !confirmPassword}
            className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {codeLoading ? <><Spinner size="sm" overlay={false} className="border-white/30 border-t-white" /> Resetting…</> : 'Reset Password'}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-5 text-center">
          {timer > 0 ? (
            <p className="text-sm text-muted">
              Resend code in <span className="font-semibold tabular-nums text-primary">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:opacity-80 disabled:opacity-50 transition-opacity"
            >
              {resending ? <Spinner size="sm" overlay={false} /> : <RefreshCw size={14} />}
              Resend code
            </button>
          )}
        </div>
      </div>
    );
  }

  // Step 1 — email input
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl border border-default shadow-medium">
      <h2 className="text-xl font-bold text-primary mb-1">Reset Password</h2>
      <p className="text-sm text-muted mb-6">
        Enter your email and we'll send you a 6-digit code to reset your password.
      </p>

      <form onSubmit={handleRequestCode} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-default bg-default text-primary focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              disabled={emailLoading}
              autoFocus
            />
          </div>
          {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
        </div>

        <button
          type="submit"
          disabled={emailLoading || !email}
          className="w-full py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {emailLoading ? <><Spinner size="sm" overlay={false} className="border-white/30 border-t-white" /> Sending…</> : 'Send Reset Code'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-default text-center">
        <p className="text-sm text-muted">
          Remember your password?{' '}
          <Link to="/signin" className="text-primary-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
