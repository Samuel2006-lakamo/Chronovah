import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

function CTAButton() {
  return (
    <div className="flex flex-col items-center gap-4 mb-12">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.92 }}
        className="w-full max-w-md bg-linear-to-r from-blue-600 to-pink-400 text-white px-8 py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-pink-500  duration-300 font-semibold text-lg transition-all flex  items-center justify-center gap-2"
        onClick={() => (window.location.href = "/dashboard")}
      >
        <span> Get Started</span>
        <span>
          <ArrowDownRight />
        </span>
      </motion.button>
      <p className="text-gray-600 text-sm">
        No payment required . Totally free
      </p>
    </div>
  );
}

export default CTAButton;