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
        className="w-full font-semibold max-w-md bg-linear-to-r from-blue-500 to-teal-300 text-white px-8 py-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-500  duration-300  text-lg transition-all flex  items-center justify-center gap-2 dark:text-gray-900"
        onClick={() => (window.location.href = "/dashboard")}
      >
        <span> Get Started</span>
        <span>
          <ArrowDownRight />
        </span>
      </motion.button>
      <motion.p
        initial={{ opacity: 0, }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.12, delay: 0.2 }}
        className="text-gray-600 text-sm dark:text-gray-300"
      >
        No payment required . Totally free
      </motion.p>
    </div>
  );
}

export default CTAButton;