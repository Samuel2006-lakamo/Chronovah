import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../hooks/useValidation";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (eErr || pErr) return;
    setFormError(null);

    try {
      await signIn(email.trim(), remember);
      navigate("/dashboard"); // change route to your app route
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: string | any) {
      setFormError(err?.message || "Failed to sign in. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#05060a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white dark:bg-[#07101a] rounded-2xl shadow-lg border border-gray-200 dark:border-[#0b1220] p-6"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/mnt/data/A_wireframe_digital_illustration_depicts_a_persona.png"
            alt="Logo"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Cronovah
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign in to continue
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                emailError
                  ? "border-red-400"
                  : "border-gray-200 dark:border-[#14202b]"
              } bg-gray-50 dark:bg-[#071620]`}
            >
              <Mail className="text-gray-500 dark:text-gray-300" />
              <input
                name="email"
                type="email"
                value={email}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mail.com"
                className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-100"
                aria-invalid={!!emailError}
                aria-describedby="email-error"
              />
            </div>
            {emailError && (
              <p id="email-error" className="text-xs mt-1 text-red-500">
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                passwordError
                  ? "border-red-400"
                  : "border-gray-200 dark:border-[#14202b]"
              } bg-gray-50 dark:bg-[#071620]`}
            >
              <Lock className="text-gray-500 dark:text-gray-300" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-100"
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#08202d]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="text-xs mt-1 text-red-500">
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              Remember me
            </label>
            <Link
              to="/forgot"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot?
            </Link>
          </div>

          {/* Error */}
          {formError && <p className="text-xs text-red-500">{formError}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-blue-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 font-semibold"
          >
            Create one
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
