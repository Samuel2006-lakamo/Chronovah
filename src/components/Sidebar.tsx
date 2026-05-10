

import { NavLink, useNavigate } from "react-router-dom";

import navItems from "../type/navItems";
import { useSidebar } from "../hooks/useSidebar";
import { LogOut, Crown, Lock, Zap } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useSubscriptionStore } from "../store/subscriptionStore";
import { db } from "../database/db";
import { useLiveQuery } from "dexie-react-hooks";


function Sidebar() {

  const { isOpen } = useSidebar();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { isProActive } = useSubscriptionStore();
  const { setIsOpen } = useSidebar();
  // Get real counts from Dexie
  const journalCount = useLiveQuery(
    async () => (user ? (await db.journal.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const peopleCount = useLiveQuery(
    async () => (user ? (await db.people.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  const placesCount = useLiveQuery(
    async () => (user ? (await db.places.where('userId').equals(user.id).count()) : 0),
    [user?.id]
  ) ?? 0;

  return (
    <aside
      onMouseEnter={() => {
        setIsOpen(true)
      }}
      onMouseLeave={() => {
        setIsOpen(false)
      }}
      className={`${
        isOpen ? "w-[260px]" : "w-20"
      } border-r top-15 border-t-0 fixed left-0 bottom-0 min-h-screen flex flex-col transition-all duration-500 bg-header`}
      style={{
        borderColor: "var(--color-border)",
        fontFamily: "var(--font-heading)",
      }}
    >
      {/* Navigation */}
      <nav className="flex-1 flex flex-col mt-6">
        {navItems.map((item) => {
          // Lock if free user AND over limit for that section
          const isLocked =
            (item.name === "Journal" && !isProActive && journalCount > 20) ||
            (item.name === "People" && !isProActive && peopleCount > 12) ||
            (item.name === "Places" && !isProActive && placesCount > 15);

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-lg mx-3 my-1 transition-all ${
                  isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : isActive
                      ? "text-white"
                      : ""
                }`
              }
              style={({ isActive }) => ({
                backgroundColor:
                  isActive && !isLocked
                    ? "var(--color-primary)"
                    : isActive
                      ? "var(--color-primary)"
                      : "transparent",
                color: isActive && !isLocked ? "white" : "var(--color-text)",
              })}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  navigate("/upgrade");
                }
              }}
            >
              <div style={{ position: "relative" }}>
                <item.icon size={20} />
                {isLocked && (
                  <Lock
                    size={12}
                    className="absolute text-accent-red"
                    style={{ bottom: -2, right: -2 }}
                  />
                )}
              </div>
              {isOpen && (
                <div className="flex-1 flex transition-all duration-500 items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.name === "Journal" && journalCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        journalCount > 20
                          ? "bg-red-500/10 text-accent-red"
                          : "bg-default text-muted"
                      }`}
                    >
                      {journalCount > 20 ? `${journalCount}/20` : journalCount}
                    </span>
                  )}
                  {item.name === "People" && peopleCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        peopleCount > 12
                          ? "bg-red-500/10 text-accent-red"
                          : "bg-default text-muted"
                      }`}
                    >
                      {peopleCount > 12 ? `${peopleCount}/12` : peopleCount}
                    </span>
                  )}
                  {item.name === "Places" && placesCount > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        placesCount > 15
                          ? "bg-red-500/10 text-accent-red"
                          : "bg-default text-muted"
                      }`}
                    >
                      {placesCount > 15 ? `${placesCount}/15` : placesCount}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Status Card */}
      {isOpen && (
        <div
          className="mx-3 mb-4 p-4 rounded-lg border-2"
          style={{
            backgroundColor: "var(--color-card)",
           borderColor: isProActive
              ? "var(--color-primary)"
              : "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            {isProActive ? (
              <>
                <Crown size={16} style={{ color: "var(--color-primary)" }} />
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  Pro Active
                </span>
              </>
            ) : (
              <>
                <Zap size={16} style={{ color: "var(--color-text-muted)" }} />
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  Free Plan
                </span>
              </>
            )}
          </div>
          {!isProActive && (
            <button
              onClick={() => navigate("/upgrade")}
              className="w-full py-2 px-3 text-white text-xs font-bold rounded-lg transition-all hover:shadow-md"
              style={{ background: "var(--color-primary-500)" }}
            >
              Upgrade Now
            </button>
          )}
          {isProActive && (
            <button
              onClick={() => navigate("/billing")}
              className="w-full py-2 px-3 text-xs font-bold rounded-lg transition-all"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              Manage Plan
            </button>
          )}
        </div>
      )}

      {/* Logout */}
      <div
        onClick={logout}
        className="p-4 mb-15 flex border-t items-center gap-2 cursor-pointer transition-colors hover:opacity-70"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        <LogOut size={16} className="ml-2" />
        {isOpen && <span className="text-xs">Logout</span>}
      </div>
    </aside>
  );
}

export default Sidebar;
