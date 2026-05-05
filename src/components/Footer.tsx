import { useNavigate } from "react-router-dom";
import { Box } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", to: "/#features" },
    { label: "Pricing",  to: "/pricing" },
  ],
  Company: [
    { label: "About",   to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy",   to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy",    to: "/refund" },
  ],
};

export default function Footer() {
  const navigate = useNavigate();

  const handleClick = (to: string) => {
    if (to.startsWith("mailto") || to.startsWith("http")) return; // handled by <a>

    // Hash-only links on the same page — scroll to section
    if (to.startsWith("/#")) {
      const id = to.slice(2); // strip "/#"
      if (window.location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        // Give the page time to mount before scrolling
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      return;
    }

    navigate(to);
  };

  return (
    <footer className="border-t border-default bg-default">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <button
              onClick={() => navigate("/")}
              className="mb-4 flex items-center gap-2"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-primary-500 blur-md opacity-50" />
                <Box className="relative h-7 w-7 rounded-xl bg-primary-500 p-1.5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-primary">Chronovah</span>
            </button>
            <p className="max-w-[220px] text-sm leading-relaxed text-muted">
              An offline-first personal workspace for notes, places, people, and journal.
            </p>
            <p className="mt-5 text-xs text-muted">
              &copy; {new Date().getFullYear()} Chronovah. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
                {group}
              </p>
              <ul className="space-y-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    {to.startsWith("mailto") || to.startsWith("http") ? (
                      <a
                        href={to}
                        className="text-sm text-muted transition-colors hover:text-primary"
                      >
                        {label}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleClick(to)}
                        className="text-sm text-muted transition-colors hover:text-primary"
                      >
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-default pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            Built with an offline-first architecture.
          </p>
          <p className="text-xs font-medium text-muted">
            <span className="text-primary">No refunds</span> — all payments are final.
          </p>
        </div>
      </div>
    </footer>
  );
}
