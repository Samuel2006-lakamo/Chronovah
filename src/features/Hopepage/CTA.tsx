import { motion } from "framer-motion";
import CTAButton from "../../ui/CTAButton";


export default function CTAComponent() {


  return (
    <section
      className="w-full py-20 px-6 md:px-20 
        dark:bg-[#0B1120] white transition-colors"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold 
            dark:text-white text-gray-900
          "
        >
          Organize Your Life Seamlessly
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-gray-600 dark:text-gray-400 text-lg md:text-xl`}
        >
          Track your notes, people, places, and journeys in one secure and
          easy-to-use app.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CTAButton />
        </motion.div>

        <motion.div
          className="w-24 h-1 mx-auto rounded-full mt-6 dark:linear-gradient(to right, #2b6cb0, #4299e1) linear-gradient(to right, #2b6cb0, #4299e1)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          
        />
      </div>
    </section>
  );
}
