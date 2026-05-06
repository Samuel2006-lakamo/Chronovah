import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, RefreshCw, CheckCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../ui/Spinner";
import { protectedAxios } from "../../axios";

export default function OtpVerification() {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from signup via navigation state
  const email: string = (location.state as any)?.email || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await protectedAxios.put("/user/verify-email", { verificationCode: code });
      // Store token for Safari (cross-origin cookie blocked by ITP)
      const token = response.data?.data?.accessToken || response.data?.accessToken;
      if (token) localStorage.setItem("accessToken", token);
      setVerified(true);
      await refresh();
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email address not found. Please sign up again.");
      return;
    }
    setResending(true);
    setError("");
    try {
      await protectedAxios.post("/user/resend-verification", { email });
      setOtp(Array(6).fill(""));
      setTimer(60);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      setError(err?.message || "Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-default p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-primary">Email verified!</h2>
          <p className="mt-2 text-sm text-muted">Redirecting to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-default p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-default bg-card p-8 shadow-medium">
          {/* Icon */}
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/10">
            <Mail size={22} className="text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-2xl font-bold text-primary">Check your email</h1>
          <p className="mt-2 text-sm text-muted">
            We sent a 6-digit code to{" "}
            {email ? (
              <span className="font-semibold text-primary">{email}</span>
            ) : (
              "your email address"
            )}
            . Enter it below to verify your account.
          </p>

          {/* OTP inputs */}
          <div
            className="mt-8 flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`h-12 w-10 rounded-xl border text-center text-lg font-bold text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:h-14 sm:w-12 ${
                  error
                    ? "border-red-500 bg-red-500/5"
                    : digit
                    ? "border-primary-500/60 bg-primary-500/5"
                    : "border-default bg-default"
                }`}
                aria-label={`Digit ${i + 1}`}
                disabled={loading}
              />
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-3 text-center text-xs text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Spinner size="sm" overlay={false} className="border-white/30 border-t-white" />
                Verifying…
              </>
            ) : (
              "Verify email"
            )}
          </button>

          {/* Resend */}
          <div className="mt-5 text-center">
            {timer > 0 ? (
              <p className="text-sm text-muted">
                Resend code in{" "}
                <span className="font-semibold tabular-nums text-primary">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-opacity hover:opacity-80 disabled:opacity-50 dark:text-primary-400"
              >
                {resending ? (
                  <Spinner size="sm" overlay={false} />
                ) : (
                  <RefreshCw size={14} />
                )}
                Resend code
              </button>
            )}
          </div>

          {/* Back link */}
          <Link
            to="/signin"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
