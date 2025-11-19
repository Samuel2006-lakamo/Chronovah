import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CTAButton from "../../ui/CTAButton";
import { Box, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";

interface DotProp {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Hero() {
    const {isDarkMode, toggleDarkMode} = useDarkMode();
  const [floatingDots, setFloatingDots] = useState<DotProp[]>([]);

  useEffect(() => {
    const dots = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 50 + 50,
    }));
    setFloatingDots(dots);
  }, []);

  return (
    <section className="min-h-screen bg-linear-to-r from-blue-100 via-pink-50 to-yellow-50 relative overflow-hidden flex justify-center items-center text-center px-4 py-20">
      <div className="absolute -top-2 -left-5 w-36 h-4  rounded-2xl bg-blue-700"></div>
      <header className="fixed rounded-full top-3 w-full px-4 py-3 max-w-3xl flex justify-between items-center z-30 shadow-md backdrop-blur-lg bg-white/50 backdrop-saturate-150 bg-linear-to-r from-blue-100 via-pink-50 to-yellow-50">
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 rounded-xl bg-blue-500 text-gray-800 dark:text-gray-100 tracking-wide" />
          <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
            Chronova
          </h1>
        </div>
        <div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 transition"
          >
            {isDarkMode ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>
      {floatingDots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-blue-900 opacity-20 animate-float"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}

      <div className="hero-content relative z-20 flex flex-col items-center justify-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-primary mb-3"
        >
          <span>Keep Track of your </span>
          <br />
          <span className="bg-gradient-to-r from-blue-700 via-pink-500 to-pink-300 bg-clip-text text-transparent">
            Life Details
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg opacity-80"
        >
          Organize your Places, People & Notes — all in one simple dashboard.
        </motion.p>

        <CTAButton />
      </div>
    </section>
  );
}
