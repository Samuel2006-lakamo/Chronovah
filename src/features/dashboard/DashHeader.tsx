import { motion } from "framer-motion";
import { Quote, Crown, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSubscriptionStore } from "../../store/subscriptionStore";
import UserAvatar from "../../components/UserAvatar";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const TAGLINES = [
  "What's worth remembering today?",
  "A place you visited. A person you met. A thought worth keeping.",
  "Your life is worth documenting.",
  "What happened today that you don't want to forget?",
  "Someone new, somewhere new, something new — capture it.",
  "The details you save today become the memories you treasure tomorrow.",
  "What do you want to remember a year from now?",
  "Every moment logged is a moment preserved.",
  "Who did you meet? Where did you go? What did you think?",
  "Your story, your way — one entry at a time.",
];

function DashHeader() {
  const { user } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const navigate = useNavigate();
  const { name, avatar, favoriteQuote } = user || {};

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Pick a random tagline — stable per session (changes on refresh)
  const tagline = useMemo(
    () => TAGLINES[Math.floor(Math.random() * TAGLINES.length)],
    []
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl shadow-sm p-3 sm:p-4 md:p-5 flex justify-between flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border border-default"
      aria-label="Dashboard header"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <UserAvatar
          name={name}
          avatar={avatar}
          size="w-12 h-12"
          textSize="text-base"
        />

        {/* Text */}
        <div>
          <h2 className="text-lg font-semibold text-primary leading-snug">
            {greeting()}, {name?.split(" ")[0] || "there"} 👋
          </h2>

          {/* Tagline — replaces email */}
          <p className="text-sm text-muted mt-0.5 max-w-xs">{tagline}</p>

          {/* Favorite quote if set */}
          {favoriteQuote && (
            <p className="text-xs text-muted mt-1.5 flex items-start gap-1.5 max-w-xs italic">
              <Quote size={11} className="flex-shrink-0 mt-0.5 text-primary-500" />
              <span className="line-clamp-2">{favoriteQuote}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right side — upgrade or pro badge */}
      {isProActive ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 flex-shrink-0">
          <Crown size={15} className="text-primary-500" />
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            Pro
          </span>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/upgrade")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-soft hover:shadow-glow flex-shrink-0"
        >
          <Zap size={15} />
          <span>Upgrade</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </motion.button>
      )}
    </motion.section>
  );
}

export default DashHeader;
