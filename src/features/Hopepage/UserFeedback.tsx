import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

const feedbacks = [
  {
    id: 1,
    name: "Blessing A.",
    text: "Chronovah helped me organize everything. Notes, places, memories — all in one secure place.",
    image: "/avatars/user1.jpg",
  },
  {
    id: 2,
    name: "Daniel T.",
    text: "The offline support is crazy good. My data is always with me, even without internet.",
    image: "/avatars/user2.jpg",
  },
  {
    id: 3,
    name: "Mary J.",
    text: "The UI is clean and fast. I love how simple it is to save and search everything.",
    image: "/avatars/user3.jpg",
  },
  {
    id: 4,
    name: "John K.",
    text: "Best productivity tool I’ve used this year. Sync + privacy is top notch.",
    image: "/avatars/user4.jpg",
  },
];

export default function UserFeedback() {
  const controls = useAnimationControls();
  const [isPaused, setPaused] = useState(false);

  // Start animation
  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 18,
          ease: "linear",
        },
      });
    } else {
      controls.stop();
    }
  }, [isPaused,controls]);

  return (
    <section className="w-full py-20 dark:bg-[#0B1120] dark:text-white text-gray-800 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-10 ">
        What Our Users Say
      </h2>

      <div
        className="relative w-full flex overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <motion.div className="flex gap-6" animate={controls}>
          {[...feedbacks, ...feedbacks].map((item, index) => (
            <div
              key={item.id + "-" + index}
              className="min-w-[300px] max-w-[300px] dark:bg-[#0B1120] bg-gray-50 border border-white/10 rounded-xl p-5 shadow-lg text-gray-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border  border-gray-300 dark:border-white/20 shadow-2xl"
                />
                <p className="font-semibold dark:text-white">{item.name}</p>
              </div>

              <p className="dark:text-white/80  text-sm leading-relaxed">
                “{item.text}”
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
