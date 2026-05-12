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
    // AppLayout already adds pt-[60px] for the fixed header.
    // This just adds comfortable breathing room inside the content area.
    <div className="py-12 sm:py-8 md:py-6 p px-3 sm:px-4 md:px-6 pb-24">
      <div className=" mx-auto">
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
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted mt-1">{description}</p>
          )}
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
