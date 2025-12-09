import { motion } from "framer-motion";
import { MapPin, Users, NotebookPen, Book } from "lucide-react";



export default function Features() {
    
    const features = [
      {
        title: "Places",
        desc: "Save locations, memories, photos, and places you’ve been.",
        icon: (
          <MapPin
            size={40}
            className="text-primary text-blue-800 dark:text-blue-400"
          />
        ),
      },
      {
        title: "Notes",
        desc: "Save ideas, reminders, lists, and everything on your mind.",
        icon: (
          <NotebookPen
            size={40}
            className="w-6 h-6 text-yellow-900 dark:text-yellow-400"
          />
        ),
      },
      {
        title: "People",
        desc: "Store details about friends, family, clients, and relationships.",
        icon: (
          <Users
            size={40}
            className="text-primary text-green-900 dark:text-green-400"
          />
        ),
      },

      {
        title: "Journal",
        desc: "Track your thoughts, mood, and daily emotional progress.",
        icon: (
          <Book
            size={40}
            className="text-primary  text-purple-900 dark:text-purple-400"
          />
        ),
      },
    ];

  return (
    <section
      id="features"
      className="px-6 md:px-12 py-16 bg-gray-50 dark:bg-gray-900 relative outline-0 border-0 "
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 dark:text-white text-gray-900">
        What Cronova Helps You Manage
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, delay: i * 0.3 }}
            className="bg-white dark:bg-black/20 text-gray-900 flex flex-col items-center border-white/10 backdrop-blur-sm rounded-xl text-center  p-6 dark:shadow-gray-900 hover:shadow-lg transition "
          >
            <div className="text-4xl mb-4 bg-white dark:bg-gray-950 w-[100px] h-[100px] text-center flex items-center justify-center p-4 rounded-2xl shadow-lg">
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">
              {f.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
