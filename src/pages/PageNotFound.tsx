import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import NotFoundIllustration from "../assets/notfound.svg"; 

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">

      <motion.img
        // src={NotFoundIllustration}
        alt="Not Found Illustration"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-64 mb-8"
      />

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-gray-800 dark:text-gray-100"
      >
        Page Not Found
      </motion.h1>

      <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-md">
        The page you're looking for doesn’t exist or has been moved.
      </p>

      <Link to="/" className="mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700"
        >
          Go Home
        </motion.button>
      </Link>

    </div>
  );
}
