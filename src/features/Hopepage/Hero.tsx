import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CTAButton from "../../ui/CTAButton";
import { Box, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { NavLink } from "react-router-dom";

interface DotProp {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

type Metrics = {
  totalUsers: number;
  activeUsers: number;
};

export default function Hero() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [floatingDots, setFloatingDots] = useState<DotProp[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeUsers: 0,
  });
  const [targets, setTargets] = useState<Metrics>({
    totalUsers: 1200,
    activeUsers: 320,
  });
  const [animState, setAnimState] = useState<{
    currentTotal: number;
    currentActive: number;
  }>({
    currentTotal: 0,
    currentActive: 0,
  });

  // Initialize dots
  useEffect(() => {
    const dots = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 10,
      duration: Math.random() * 50 + 50,
    }));
    setFloatingDots(dots);
  }, []);

  // Simple count-up animation helper
  const animateValue = (
    start: number,
    end: number,
    durationMs: number,
    onUpdate: (n: number) => void
  ) => {
    const startTime = performance.now();
    const animate = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutQuad for nice feel
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = Math.round(start + (end - start) * eased);
      onUpdate(value);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // Update targets (could be from API)
  // Example: simulate occasional updates to reflect live data
  useEffect(() => {
    // Mock: every 15 seconds, bump targets a bit
    const interval = setInterval(() => {
      setTargets((t) => ({
        totalUsers: t.totalUsers + Math.floor(Math.random() * 20),
        activeUsers: Math.max(
          0,
          t.activeUsers + Math.floor(Math.random() * 10 - 2)
        ),
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // On targets change, animate to new values
  useEffect(() => {
    // animate totalUsers
    animateValue(metrics.totalUsers, targets.totalUsers, 700, (v) => {
      setMetrics((m) => ({ ...m, totalUsers: v }));
      setAnimState((a) => ({ ...a, currentTotal: v }));
    });
    // animate activeUsers
    animateValue(metrics.activeUsers, targets.activeUsers, 500, (v) => {
      setMetrics((m) => ({ ...m, activeUsers: v }));
      setAnimState((a) => ({ ...a, currentActive: v }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets.totalUsers, targets.activeUsers]);

  // Seed initial render
  useEffect(() => {
    // start from 0 to initial targets
    setMetrics({ totalUsers: 0, activeUsers: 0 });
    setAnimState({ currentTotal: 0, currentActive: 0 });
    // small delay to allow DOM paint
    const t = setTimeout(() => {
      setTargets({ totalUsers: 1200, activeUsers: 320 });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen bg-linear-to-r from-teal-50 via-blue-100 to-yellow-50 relative overflow-hidden flex justify-center items-center text-center px-4 py-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 ">
      <div className="absolute -top-2 -left-5 w-36 h-4  rounded-2xl bg-blue-700"></div>

      <header className="fixed rounded-full top-3 w-full px-4 py-3 max-w-3xl flex justify-between items-center z-30 shadow-md backdrop-blur-lg  ">
        <div className="flex items-center gap-2">
          <Box className="w-8 h-8 rounded-xl  text-blue-600 dark:text-blue-500 tracking-wide" />
          <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
            Chronovah
          </h1>
        </div>
        <div className="flex items-center justify-center">
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
          <NavLink
            to="/dashboard"
            className=" text-center px-2 py-0.5 bg-blue-500  text-white  rounded-md dark:text-gray-100 ml-2 font-medium hover:bg-blue-400  transition"
          >
          Sign-in
          </NavLink>
        </div>
      </header>

      {floatingDots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full bg-blue-900 opacity-30 animate-float dark:opacity-70"
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

      <div className="hero-content relative  flex flex-col items-center justify-center transition-colors duration-700">
        {/* <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      w-[400px] h-[450px] rounded-full 
    bg-[radial-gradient(circle,rgba(0,90,255,0.55)_0%,rgba(80,0,255,0.25)_40%,rgba(5,10,30,0)_70%)]
      blur-[120px] opacity-70 bg-no-repeat"
          ></div>
        </div> */}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.12, delay: 1.2 }}
          className="text-3xl font-bold text-primary mb-3 mt-10 md:text-5xl lg:text-6xl leading-tight text-gray-900 text-center dark:text-white/90 transition-colors duration-300"
        >
          <span>Keep Track of your </span>
          <br />
          <span className="text-blue-500">
            Life Details
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-lg text-gray-900 dark:text-white/70 opacity-80 mb-5"
        >
          Organize your Places, People, Notes & Journal — all in one simple
          dashboard.
        </motion.p>

        <CTAButton />

        {/* Animated metrics row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.12, delay: 0.2 }}
          className="mt-6 w-full max-w-md mx-auto bg-white/70 dark:bg-[#1E293B] backdrop-blur-md backdrop-saturate-150 relative rounded-lg py-3 shadow-lg"
          aria-live="polite"
          aria-label="Live metrics: total users and active users"
        >
          <div className="flex justify-between">
            <span className="inline-flex items-center gap-2 px-3 ">
              <div>
                <span className="font-semibold text-blue-500 text-[3rem] dark:text-blue-500 font-mono  dark:shadow-[ 0 0 8px rgba(46, 227, 212, 0.8)]">
                  {animState.currentTotal.toLocaleString()}+
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-500"
                    aria-hidden="true"
                  >
                    <path d="M7 11l5-5 5 5v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-7z" />
                  </svg>
                  <span className="text-lg dark:text-blue-400"> users</span>
                </div>
              </div>
            </span>



            <div className="w-2 h-full  top-0 rounded-2xl bg-blue-500 absolute dark:bg-blue-500"></div>





            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full ">
              <div>
                <span className="font-semibold text-blue-500 text-[3rem] dark:text-blue-500 font-mono  dark:shadow-[ 0 0 8px rgba(46, 227, 212, 0.8)]">
                  {animState.currentActive.toLocaleString()}+
                </span>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-green-500"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-5-5 1.5-1.5L11 13l6.5-6.5L19 8l-8 9z" />
                  </svg>
                  <span className="text-lg dark:text-green-300 ">Active</span>
                </div>
              </div>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
