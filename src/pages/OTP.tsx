import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function OtpVerification() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) return setError("Invalid OTP code.");
    setError("");

    // Backend connect here
    console.log("OTP entered:", code);
  };

  const resend = () => {
    setTimer(30);
    setOtp(Array(6).fill(""));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#05060a] p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white dark:bg-[#07101a] rounded-2xl shadow-lg border border-gray-200 dark:border-[#0b1220] p-6"
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Verify OTP
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength={1}
              ref={(el) => { inputsRef.current[index] = el; }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center rounded-xl border border-gray-300 dark:border-[#14202b] bg-gray-50 dark:bg-[#071620] text-lg font-semibold text-gray-900 dark:text-gray-100 outline-none"
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Verify
        </button>

        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Resend code in {timer}s
            </p>
          ) : (
            <button
              onClick={resend}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <Link
          to="/signin"
          className="flex items-center gap-1 mt-6 text-sm text-gray-600 dark:text-gray-400 hover:underline"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
