import { motion } from "framer-motion";
import { Settings2, Quote } from "lucide-react";
import SettingLinkBtn from "../../ui/SettingLinkBtn";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../../components/UserAvatar";

function DashHeader() {
  const { user } = useAuth();
  const { email, name, avatar, favoriteQuote } = user || {};

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-xl shadow-sm p-5 md:p-6 flex justify-between flex-col sm:flex-row items-start sm:items-center gap-4 border border-default"
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
            {greeting()}, {name || "there"} 👋
          </h2>
          <p className="text-sm text-muted mt-0.5">{email}</p>

          {/* Favorite quote */}
          {favoriteQuote && (
            <p className="text-xs text-muted mt-1.5 flex items-start gap-1.5 max-w-xs italic">
              <Quote size={11} className="flex-shrink-0 mt-0.5 text-primary-500" />
              <span className="line-clamp-2">{favoriteQuote}</span>
            </p>
          )}
        </div>
      </div>

      <SettingLinkBtn to="/settings" icon={<Settings2 size={16} />}>
        Settings
      </SettingLinkBtn>
    </motion.section>
  );
}

export default DashHeader;
