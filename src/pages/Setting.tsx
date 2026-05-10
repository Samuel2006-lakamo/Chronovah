import { useNavigate } from "react-router-dom";
import {
  User,
  Palette,
  Bell,
  HardDrive,
  Shield,
  CreditCard,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscriptionStore } from "../store/subscriptionStore";

interface SettingsItem {
  icon: React.ElementType;
  label: string;
  description: string;
  path: string;
  iconBg: string;
  iconColor: string;
}

function buildSections(isProActive: boolean): { heading: string; items: SettingsItem[] }[] {
  return [
    {
      heading: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "Name, username, bio, avatar",
          path: "/settings/profile",
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-500",
        },
        {
          icon: Shield,
          label: "Account & Security",
          description: "Password, delete account",
          path: "/settings/account",
          iconBg: "bg-red-500/10",
          iconColor: "text-red-500",
        },
      ],
    },
    {
      heading: "Preferences",
      items: [
        {
          icon: Palette,
          label: "Appearance",
          description: "Theme, fonts, dark mode",
          path: "/settings/appearance",
          iconBg: "bg-purple-500/10",
          iconColor: "text-purple-500",
        },
        {
          icon: Bell,
          label: "Notifications",
          description: "Daily reminders, email preferences",
          path: "/settings/notifications",
          iconBg: "bg-yellow-500/10",
          iconColor: "text-yellow-500",
        },
      ],
    },
    {
      heading: "Data",
      items: [
        {
          icon: HardDrive,
          label: "Storage & Data",
          description: "Backup, restore, trash, manage data",
          path: "/settings/storage",
          iconBg: "bg-green-500/10",
          iconColor: "text-green-500",
        },
        {
          icon: CreditCard,
          label: isProActive ? "Billing & Plan" : "Upgrade to Pro",
          description: isProActive
            ? "Manage your subscription"
            : "Unlock unlimited journal, people & places",
          path: isProActive ? "/billing" : "/upgrade",
          iconBg: "bg-primary-500/10",
          iconColor: "text-primary-600",
        },
      ],
    },
    {
      heading: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Contact us, FAQs, feedback",
          path: "/contact",
          iconBg: "bg-teal-500/10",
          iconColor: "text-teal-500",
        },
      ],
    },
  ];
}

function SettingsRow({ item }: { item: SettingsItem }) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <button
      onClick={() => navigate(item.path)}
      className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-default transition-colors text-left group"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
        <Icon size={18} className={item.iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary">{item.label}</p>
        <p className="text-xs text-muted mt-0.5 truncate">{item.description}</p>
      </div>
      <ChevronRight
        size={16}
        className="text-muted flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </button>
  );
}

export default function Settings() {

  const { logout } = useAuth();
  const { isProActive } = useSubscriptionStore();
  const sections = buildSections(isProActive);

  return (
    // AppLayout handles header clearance via pt-[60px].
    <div className="py-6 px-3 sm:px-4 md:px-6 pb-24">
      <div className=" mx-auto">

        {/* Page title */}
        <h1 className="text-2xl font-bold text-primary tracking-tight mb-6">Settings</h1>

        {/* Settings sections */}
        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider px-1 mb-2">
                {section.heading}
              </p>
              <div className="bg-card border border-default rounded-2xl overflow-hidden divide-y divide-[var(--color-border)]">
                {section.items.map((item) => (
                  <SettingsRow key={item.path} item={item} />
                ))}
              </div>
            </div>
          ))}

          {/* Sign out */}
          <div>
            <div className="bg-card border border-default rounded-2xl overflow-hidden">
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/10">
                  <LogOut size={18} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">Sign out</p>
                  <p className="text-xs text-muted mt-0.5">Sign out of your account</p>
                </div>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted pt-2 pb-2">
            Chronovah · v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
