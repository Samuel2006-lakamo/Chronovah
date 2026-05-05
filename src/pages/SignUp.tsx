// pages/SignUp.tsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from "../hooks/useValidation";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "../features/Authentication/Oauth";
import Spinner from "../ui/Spinner";
import { authService, type SignUpCredentials } from "../services/auth.service";

export default function SignUp() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    message: string;
    color: string;
  }>({ score: 0, message: "", color: "" });

  const nameError = touched.name ? validateName(name) : "";
  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const confirmPasswordError = touched.confirmPassword
    ? validateConfirmPassword(password, confirmPassword)
    : "";

  const isFormValid =
    !nameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    name &&
    email &&
    password &&
    confirmPassword;

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "", color: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap: Record<number, { message: string; color: string }> = {
      0: { message: "Very weak", color: "bg-red-500" },
      1: { message: "Weak", color: "bg-red-500" },
      2: { message: "Fair", color: "bg-orange-500" },
      3: { message: "Good", color: "bg-yellow-500" },
      4: { message: "Strong", color: "bg-blue-500" },
      5: { message: "Very strong", color: "bg-green-500" },
    };

    setPasswordStrength({
      score,
      message: strengthMap[score].message,
      color: strengthMap[score].color,
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) return;

    setFormError(null);

    try {
      setIsLoading(true);

      const credentials: SignUpCredentials = {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      };

      await authService.signUp(credentials);

      setIsSuccess(true);
      await refresh();

      // Small delay for success animation
      setTimeout(() => {
        navigate("/otpverification", { state: { email: email.trim() } });
      }, 500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setFormError(
        err.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            Create Account
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Start your private life panel
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
              loading={loading}
            />
          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-muted">
                  or sign up with email
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onBlur={(e) => { 
                     e.currentTarget.style.borderColor =
                       nameError && touched.name
                         ? "#ef4444"
                         : "var(--color-border)";
                    setTouched((t) => ({ ...t, name: true }))
                  }}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-default)',
                    borderColor: nameError && touched.name ? '#ef4444' : 'var(--color-border)',
                    borderWidth: '1px',
                    color: 'var(--color-text)'
                  }}
                  onFocus={(e) => {
                    if (!(nameError && touched.name)) {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }
                  }}
                  
                  aria-invalid={!!nameError}
                  aria-describedby="name-error"
                  disabled={loading}
                />
              </div>
              <AnimatePresence>
                {nameError && touched.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {nameError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
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
                  disabled={loading}
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
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: 'var(--color-default)',
                    borderColor: passwordError && touched.password ? '#ef4444' : 'var(--color-border)',
                    borderWidth: '1px',
                    color: 'var(--color-text)',
                  }}
                  aria-invalid={!!passwordError}
                  aria-describedby="password-error"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 h-full rounded-full transition-colors ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : "bg-default"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength.color.replace("bg-", "text-")}`}>
                    {passwordStrength.message}
                    {passwordStrength.score < 5 && (
                      <span className="text-muted ml-1">
                        — needs: {[
                          !/[a-z]/.test(password) && "lowercase",
                          !/[A-Z]/.test(password) && "uppercase",
                          !/[0-9]/.test(password) && "number",
                          !/[^A-Za-z0-9]/.test(password) && "special char",
                          password.length < 8 && "8+ chars",
                        ].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </p>
                </div>
              )}

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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-12 py-3 bg-default border rounded-xl focus:outline-none focus:ring-2 transition-all text-primary ${
                    confirmPasswordError && touched.confirmPassword
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-default focus:border-primary-500 focus:ring-primary-500/20"
                  }`}
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby="confirm-password-error"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-default transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="text-muted" />
                  ) : (
                    <Eye size={16} className="text-muted" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {confirmPasswordError && touched.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-red-500 mt-1"
                  >
                    {confirmPasswordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-default text-primary-500 focus:ring-primary-500/20 focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-xs text-muted">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  Privacy Policy
                </Link>
              </label>
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
                  <p className="text-xs text-red-500 text-center">
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-medium hover:shadow-hard"
              style={{
                backgroundColor: loading || !isFormValid ? 'var(--color-primary)' : 'var(--color-primary)',
                opacity: loading || !isFormValid ? 0.8 : 1,
                cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Spinner
                    size="sm"
                    overlay={false}
                    className="border-white/30 border-t-white"
                  />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              Sign in
            </Link>
          </div>
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
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                  Account Created!
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Redirecting to verification...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
