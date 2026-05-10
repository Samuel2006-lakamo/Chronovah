import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsSubPageLayout({ title, description, children }: Props) {
  const navigate = useNavigate();

  return (
    // pt-20 clears fixed header on all screen sizes (header is fixed, AppLayout md:p-6 does NOT clear it)
    // pb-24 clears the mobile bottom nav
    <div className="pt-20 pb-24 px-3 sm:px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors mb-5"
        >
          <ChevronLeft size={16} />
          Settings
        </button>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted mt-1">{description}</p>
          )}
        </div>

        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
