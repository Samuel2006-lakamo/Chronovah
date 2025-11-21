import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
type FaqItem = {
  question: string;
  answer: string;
};
const faqs: FaqItem[] = [
  {
    question: "What is Chronovah?",
    answer:
      "Chronovah is a digital life organizer that stores memories, events, personal notes, and important information all in one secure place.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data is encrypted and stored safely. Only you have access to your personal vault.",
  },
  {
    question: "Can I sync across devices?",
    answer:
      "Yes. Your account syncs across all your devices so you can access your vault anytime.",
  },
  {
    question: "Does it work offline?",
    answer:
      "You can view previously loaded data offline, and updates will sync when you're online again.",
  },
  {
    question: "Is Chronovah free?",
    answer:
      "Chronovah offers both a free plan and optional premium features for users who need more storage and customization.",
  },
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className=" mx-auto py-12 px-4 dark:bg-gray-900 bg-gray-50 ">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20,y:20 }}
            whileInView={{ opacity: 1, x: 0 ,y:0  }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-xl border border-gray-200 bg-white dark:bg-gray-800 hover:dark:bg-gray-800 dark:border-gray-800 shadow-sm"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left"
              aria-expanded={openIndex === i}
              aria-controls={`faq-${i}-panel`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
            >
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                {item.question}
              </span>
              <ChevronDown
                className={`transition-transform dark:text-white duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                {item.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
