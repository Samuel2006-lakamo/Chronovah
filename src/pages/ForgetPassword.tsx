import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { validateEmail } from "../hooks/useValidation";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailError = touched ? validateEmail(email) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (validateEmail(email)) return;

    setLoading(true);

    // Simulate sending reset link
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSent(true);
    navigate("/otpverification");
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
              Reset Password
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A recover code will be sent to your email
            </p>
          </div>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
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
                  onBlur={() => setTouched(true)}
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
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) }

        {/* Back link */}
        <div className="mt-6">
          <Link
            to="/signin"
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            <ArrowLeft size={16} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
