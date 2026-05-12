// pages/SignIn.tsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validateSignInPassword } from "../hooks/useValidation";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GoogleAuthButton } from "../features/Authentication/Oauth";
import Spinner from "../ui/Spinner";
import { authService, type SignInCredentials } from "../services/auth.service";

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const { refresh } = useAuth();

  // Handle OAuth error redirect from backend
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      setFormError("Google sign-in failed. Please try again or use email and password.");
    }
  }, [searchParams]);
  //   email: "demo@chronovah.xyz",
  //   password: "Demo123!",
  // };

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validateSignInPassword(password) : "";
  const isFormValid = !emailError && !passwordError && email && password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;

    setFormError(null);
    setNeedsVerification(false);

    try {
      setIsLoading(true);

      const credentials: SignInCredentials = {
        email: email.trim(),
        password,
      };

      const response = await authService.signIn(credentials);

      // Store token if provided
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }

      setIsSuccess(true);
       refresh();

      // Small delay for success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg: string = err.message || "Failed to sign in. Please try again.";
      // Backend returns "Please verify your email first" with a 403
      if (msg.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
        setFormError(msg);
      } else {
        setFormError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleDemoLogin = () => {
  //   setEmail(demoCredentials.email);
  //   setPassword(demoCredentials.password);
  //   setRemember(true);
  //   // Auto-submit after setting demo credentials
  //   setTimeout(() => {
  //     if (isFormValid) {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       handleSubmit(new Event("submit") as any);
  //     }
  //   }, 100);
  // };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-bg)' }}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            Welcome Back
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Sign in to continue your journey
          </p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-medium"
          style={{
            backgroundColor: 'var(--color-card)',
            borderColor: 'var(--color-border)',
            borderWidth: '1px',
          }}
        >
          {/* Demo Credentials Banner */}
          {/* <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 p-4 bg-primary-500/5 rounded-xl border border-primary-500/10"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-500/20 rounded-lg">
                <Zap size={16} className="text-primary-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary mb-2">
                  Quick Demo Access
                </p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  Use Demo Account
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </motion.div> */}

          {/* Social Login */}
          <div className="space-y-3">
            <GoogleAuthButton
              onClick={() => {
                const apiUrl = import.meta.env.DEV
                  ? "http://localhost:8000/api/v1"
                  : (import.meta.env.VITE_API_URL || "https://api-chronovah-backend.onrender.com/api/v1");
                window.location.href = `${apiUrl}/oauth/google`;
              }}
              label="Continue with Google"
              loading={isLoading}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-muted">
                  or sign in with email
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  type="email"
                  value={email}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-default)',
                    borderColor: emailError && touched.email ? '#ef4444' : 'var(--color-border)',
                    borderWidth: '1px',
                    color: 'var(--color-text)',
                  }}
                  aria-invalid={!!emailError}
                  aria-describedby="email-error"
                  disabled={isLoading}
                />
              </div>
              <AnimatePresence>
                {emailError && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: 'var(--color-text-muted)' }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-default)',
                    borderColor: passwordError && touched.password ? '#ef4444' : 'var(--color-border)',
                    borderWidth: '1px',
                    color: 'var(--color-text)',
                  }}
                  aria-invalid={!!passwordError}
                  aria-describedby="password-error"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {passwordError && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{
                    borderColor: 'var(--color-border)',
                    accentColor: 'var(--color-primary)',
                  }}
                  disabled={isLoading}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Remember me</span>
              </label>
              <Link
                to="/forgot"
                className="text-sm transition-opacity hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-xs text-red-500 text-center">{formError}</p>
                  {needsVerification && (
                    <div className="mt-2 text-center">
                      <Link
                        to="/otpverification"
                        state={{ email: email.trim() }}
                        className="text-xs font-semibold text-primary-600 underline underline-offset-2 hover:opacity-80 dark:text-primary-400"
                      >
                        Go to verification page →
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-medium hover:shadow-hard"
              style={{
                backgroundColor: isLoading || !isFormValid ? 'var(--color-primary)' : 'var(--color-primary)',
                opacity: isLoading || !isFormValid ? 0.6 : 1,
                cursor: isLoading || !isFormValid ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <Spinner
                    size="sm"
                    overlay={false}
                    className="border-white/30 border-t-white"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              Create one
            </Link>
          </div>

          {/* Legal links */}
          <p className="mt-5 text-center text-xs text-muted">
            By signing in you agree to our{" "}
            <Link to="/terms" className="text-primary-600 hover:underline dark:text-primary-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary-600 hover:underline dark:text-primary-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="rounded-2xl p-8 shadow-hard text-center"
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderWidth: '1px',
                }}
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-10 h-10 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  Welcome Back!
                </h3>
                <p className="text-sm text-muted">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
