import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useCallback } from "react";
import navItems from "../type/navItems";
import { useSidebar } from "../hooks/useSidebar";
import { LogOut, Crown, Lock, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscriptionStore } from "../store/subscriptionStore";
import { db } from "../database/db";
import { useLiveQuery } from "dexie-react-hooks";

// Notion-style: small delay before expanding, instant collapse
const EXPAND_DELAY = 180; // ms before expanding on hover
const COLLAPSE_DELAY = 80; // ms before collapsing on leave

function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { isProActive } = useSubscriptionStore();

  // Timer refs so we can cancel pending open/close
  const expandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    // Cancel any pending collapse
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    // Schedule expand after short delay
    expandTimer.current = setTimeout(() => {
      setIsOpen(true);
    }, EXPAND_DELAY);
  }, [setIsOpen]);

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending expand
    if (expandTimer.current) {
      clearTimeout(expandTimer.current);
      expandTimer.current = null;
    }
    // Schedule collapse
    collapseTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, COLLAPSE_DELAY);
  }, [setIsOpen]);

  const journalCount = useLiveQuery(
    async () => (user ? await db.journal.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;

  const peopleCount = useLiveQuery(
    async () => (user ? await db.people.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;

  const placesCount = useLiveQuery(
    async () => (user ? await db.places.where("userId").equals(user.id).count() : 0),
    [user?.id]
  ) ?? 0;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Use inline style for width so CSS transition actually fires smoothly
      style={{
        width: isOpen ? "260px" : "72px",
        transition: "width 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        borderColor: "var(--color-border)",
        fontFamily: "var(--font-heading)",
      }}
      className="border-r top-15 border-t-0 fixed left-0 bottom-0 min-h-screen flex flex-col overflow-hidden bg-header"
    >
      {/* Navigation */}
      <nav className="flex-1 flex flex-col mt-6">
        {navItems.map((item) => {
          const isLocked =
            (item.name === "Journal" && !isProActive && journalCount > 20) ||
            (item.name === "People" && !isProActive && peopleCount > 12) ||
            (item.name === "Places" && !isProActive && placesCount > 15);

          // Count badge value
          const countMap: Record<string, number> = {
            Journal: journalCount,
            People: peopleCount,
            Places: placesCount,
          };
          const limitMap: Record<string, number> = {
            Journal: 20,
            People: 12,
            Places: 15,
          };
          const count = countMap[item.name];
          const limit = limitMap[item.name];
          const showCount = count !== undefined && count > 0;
          const overLimit = count > limit;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center mx-2 my-0.5 rounded-lg transition-colors duration-150 ${
                  isLocked ? "opacity-50 cursor-not-allowed" : ""
                } ${isActive && !isLocked ? "text-white" : ""}`
              }
              style={({ isActive }) => ({
                backgroundColor:
                  isActive && !isLocked ? "var(--color-primary-500)" : "transparent",
                color: isActive && !isLocked ? "white" : "var(--color-text)",
                // Fixed height so items don't shift
                minHeight: "44px",
                padding: "0 12px",
              })}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  navigate("/upgrade");
                }
              }}
            >
              {/* Icon — always visible, centered when collapsed */}
              <div
                className="relative flex-shrink-0 flex items-center justify-center"
                style={{ width: "24px" }}
              >
                <item.icon size={20} />
                {isLocked && (
                  <Lock
                    size={11}
                    className="absolute text-accent-red"
                    style={{ bottom: -2, right: -4 }}
                  />
                )}
              </div>

              {/* Label + badge — fade + slide in when open */}
              <div
                className="flex flex-1 items-center justify-between ml-3 overflow-hidden"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(-6px)",
                  transition: "opacity 200ms ease, transform 200ms ease",
                  // Delay label appearance slightly so it doesn't show during collapse
                  transitionDelay: isOpen ? "60ms" : "0ms",
                  whiteSpace: "nowrap",
                  pointerEvents: isOpen ? "auto" : "none",
                }}
              >
                <span className="text-sm font-medium">{item.name}</span>
                {showCount && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      overLimit
                        ? "bg-red-500/10 text-accent-red"
                        : "bg-default text-muted"
                    }`}
                  >
                    {overLimit ? `${count}/${limit}` : count}
                  </span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Pro / Upgrade card */}
      <div
        className="mx-2 mb-3 overflow-hidden rounded-lg border"
        style={{
          borderColor: isProActive ? "var(--color-primary-500)" : "var(--color-border)",
          backgroundColor: "var(--color-card)",
          // Collapse to icon-only height when closed
          maxHeight: isOpen ? "120px" : "44px",
          transition: "max-height 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Always-visible icon row */}
        <div
          className="flex items-center gap-2 px-3"
          style={{ minHeight: "44px" }}
        >
          {isProActive ? (
            <Crown size={16} style={{ color: "var(--color-primary-500)", flexShrink: 0 }} />
          ) : (
            <Zap size={16} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
          )}
          <span
            className="text-xs font-bold overflow-hidden"
            style={{
              color: "var(--color-text)",
              opacity: isOpen ? 1 : 0,
              transition: "opacity 200ms ease",
              transitionDelay: isOpen ? "60ms" : "0ms",
              whiteSpace: "nowrap",
            }}
          >
            {isProActive ? "Pro Active" : "Free Plan"}
          </span>
        </div>

        {/* Button — only visible when expanded */}
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 150ms ease",
            transitionDelay: isOpen ? "80ms" : "0ms",
            padding: "0 12px 12px",
          }}
        >
          {isProActive ? (
            <button
              onClick={() => navigate("/billing")}
              className="w-full py-1.5 px-3 text-xs font-bold rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              Manage Plan
            </button>
          ) : (
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full py-1.5 px-3 text-white text-xs font-bold rounded-lg transition-colors hover:opacity-90"
              style={{ background: "var(--color-primary-500)" }}
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>

      {/* Logout */}
      <div
        onClick={logout}
        className="flex border-t items-center gap-3 cursor-pointer transition-colors hover:opacity-70 mb-16"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
          padding: "12px 14px",
          minHeight: "48px",
        }}
      >
        <LogOut size={16} style={{ flexShrink: 0 }} />
        <span
          className="text-xs overflow-hidden"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 200ms ease",
            transitionDelay: isOpen ? "60ms" : "0ms",
            whiteSpace: "nowrap",
          }}
        >
          Logout
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
