import { motion } from "framer-motion";
import { div } from "framer-motion/client";
import { useEffect, useState } from "react";
interface DotProp{
  id: number,
  left: number,
  top: number,
  size: number,
  delay: number,
  duration: number
}
export default function Hero() {
  const [floatingDots, setFloatingDots] = useState<DotProp[]>()
  useEffect(
    () => {
      const dots = Array.from({ length: 90 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 8 + 4,
        delay: Math.random() * 10,
        duration: Math.random() * 50 + 50
      }));
      setFloatingDots(dots)
  },[]
)

  return (
    <section className="min-h-screen bg-gradient-to-r from-blue-100 via-pink-50 to-yellow-50 relative overflow-hidden">
      {floatingDots?.map((dot) => (
        <div key={dot.id} className="absolute rounded-full bg-blue-900 opacity-20 animate-float"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`, 
        }}>
  
</div>))}
      {/* Gradient overlay above images */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-700 to-gray-900 opacity-90 z-5"></div> */}

      {/* Text content wrapper explicitly on top */}
      {/* <div className="hero-content relative z-20 inline-block w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl z-100 font-bold text-primary mb-3"
        >
          Life Panel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg opacity-80 z-100"
        >
          Organize your Places, People & Notes — all in one simple dashboard.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.92 }}
          className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-md"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Enter App
        </motion.button>
      </div> */}
    </section>
  );
}
