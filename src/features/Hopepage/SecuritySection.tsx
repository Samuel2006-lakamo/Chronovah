import { motion } from "framer-motion";

const items = [
  "End-to-end encrypted sync",
  "Secure cloud backup",
  "Offline protection",
  "Zero third-party sharing",
  "Full user control",
];

export default function SecuritySection() {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-gray-900">
        Your Data, Fully Secured
      </h2>
      <p className="text-center max-w-xl mx-auto mb-12 text-gray-700 dark:text-gray-300">
        Privacy isn’t an optional feature — it’s the foundation of our system.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0,x:30 }}
            whileInView={{ opacity: 1,x:0}}
            viewport={{ once: false }}
            transition={{duration: 0.4, delay: i * 0.1 }}
            className="bg-white p-5 rounded-xl shadow text-center dark:bg-gray-800 dark:text-gray-200 text-gray-900 font-medium hover:shadow-lg transition "
          >
            {item}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
