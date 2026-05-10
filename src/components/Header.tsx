import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  
  Search,
  Box,
  Menu,
  X,
  Home,
  MapPin,
  Users,
  BookOpen,
  Compass,
  Settings,
  LogOut,
  User,
  ChevronDown,
  LogIn,
  UserPlus,
  Sidebar,
  Zap,
  Crown,
  Moon,
  Sun,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useSidebar } from "../hooks/useSidebar";
import GlobalSearch from "../ui/GlobalSearch";
import { useSearch } from "../hooks/useSearch";
import DesktopSearchInput from "../ui/DesktopSearchInput";
import { useAuth } from "../hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
import { useSubscriptionStore } from "../store/subscriptionStore";
import SyncIndicator from "./SyncIndicator";
import UserAvatar from "./UserAvatar";

function Header() {
  const { openSearch, setOpenSearch } = useSearch();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toggleSidebar, isOpen } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isProActive } = useSubscriptionStore();

  // Ref for the profile dropdown container — used to detect outside clicks
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside of it
  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const isAuthenticated = !!user;
  const { name = "User", email } = user || {};

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (window.innerWidth >= 768) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const navItems = isAuthenticated
    ? [
        { path: "/dashboard", label: "Dashboard", icon: Home },
        { path: "/notes",     label: "Notes",     icon: BookOpen },
        { path: "/journeys",  label: "Journeys",  icon: Compass },
        { path: "/places",    label: "Places",    icon: MapPin },
        { path: "/people",    label: "People",    icon: Users },
      ]
    : [];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`
          flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            isScrolled
              ? "bg-default/95 backdrop-blur-md shadow-medium "
              : "bg-header  border-default"
          }
        `}
      >
        {/* Left — Logo & toggles */}
        <div className="flex items-center sm:gap-2">
          {isAuthenticated && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-default transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-muted" />
              ) : (
                <Menu size={20} className="text-muted" />
              )}
            </motion.button>
          )}

          <NavLink
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Box
                size={14}
                className="relative w-8 h-8 sm:w-10 sm:h-10  text-primary p-1.5"
              />
            </div>
            <span
              className="font-bold ml-[-6px] text-base sm:text-lg text-primary"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              Chronovah
            </span>
          </NavLink>

          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="hidden md:block p-2 rounded-lg hover:bg-default transition-colors"
              aria-label="Toggle sidebar"
            >
              <Sidebar size={20} className="text-muted" />
            </button>
          )}
        </div>

        {/* Center — Desktop search */}
        {isAuthenticated && (
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <DesktopSearchInput />
          </div>
        )}

        {/* Right — Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated && <SyncIndicator />}

          {isAuthenticated && ( <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenSearch(true)}
                className="md:hidden p-2 rounded-lg hover:bg-default transition-colors"
                aria-label="Search"
              >
                <Search size={18} className="text-muted" />
              </motion.button> )}
          <motion.button
            role="switch"
            aria-checked={isDarkMode}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            
            onClick={toggleDarkMode}
          
          >
    {isDarkMode ? (
            <Sun size={18} className="text-accent-yellow" />
          ) : (
            <Moon size={18} className="text-muted" />
          )}  
            
          </motion.button>

          {isAuthenticated ? (
            <>
             

              {/* Profile dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-default transition-colors"
                  aria-label="Profile menu"
                >
                  <UserAvatar
                    name={name}
                    avatar={user?.avatar}
                    size="w-8 h-8 sm:w-9 sm:h-9"
                    textSize="text-sm"
                  />
                  <ChevronDown
                    size={16}
                    className={`text-muted transition-transform duration-200 hidden sm:block ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-hard border border-default overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-default">
                        <p className="text-sm font-semibold text-primary truncate">
                          {name}
                        </p>
                        <p className="text-xs text-muted truncate">{email}</p>
                      </div>
                      <div className="p-1">
                        <NavLink
                          to="/settings/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-default rounded-lg transition-colors"
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </NavLink>
                        <NavLink
                          to="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-default rounded-lg transition-colors"
                        >
                          <Settings size={16} />
                          <span>Settings</span>
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent-red hover:bg-default rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <NavLink
                to="/signup"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors shadow-soft hover:shadow-glow"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </NavLink>
              <NavLink
                to="/signin"
                className="sm:hidden p-2 rounded-lg hover:bg-default transition-colors"
                aria-label="Sign In"
              >
                <LogIn size={18} className="text-muted" />
              </NavLink>
              <NavLink
                to="/signin"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </NavLink>
            </div>
          )}
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isAuthenticated && isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-card shadow-hard z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-default">
                  <div className="flex items-center gap-2">
                    <Box className="w-8 h-8 text-primary-500 p-1" />
                    <span className="font-bold text-lg text-primary"
                      style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                    >
                      Chronovah
                    </span>
                  </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-primary-500/10 text-primary-500"
                              : "text-muted hover:bg-default hover:text-primary"
                          }`
                        }
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                {isOpen && (
                  <div
                    className="mx-3 mb-4 p-4 rounded-xl border-2"
                    style={{
                      backgroundColor: "var(--color-card)",
                      borderColor: isProActive
                        ? "var(--color-primary-500)"
                        : "var(--color-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {isProActive ? (
                        <>
                          <Crown
                            size={16}
                            style={{ color: "var(--color-primary-500)" }}
                          />
                          <span className="text-xs font-bold text-primary">
                            Pro Active
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap size={16} className="text-muted" />
                          <span className="text-xs font-bold text-primary">
                            Free Plan
                          </span>
                        </>
                      )}
                    </div>
                    {!isProActive && (
                      <button
                        onClick={() => navigate("/upgrade")}
                        className="w-full py-2 px-3 text-white text-xs font-bold rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
                      >
                        Upgrade Now
                      </button>
                    )}
                    {isProActive && (
                      <button
                        onClick={() => navigate("/billing")}
                        className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-default text-primary hover:bg-default transition-colors"
                      >
                        Manage Plan
                      </button>
                    )}
                  </div>
                )}

                <div className="p-4 border-t border-default">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={name}
                      avatar={user?.avatar}
                      size="w-10 h-10"
                      textSize="text-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">
                        {name}
                      </p>
                      <p className="text-xs text-muted truncate">{email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isAuthenticated && openSearch && (
        <GlobalSearch onClose={() => setOpenSearch(false)} />
      )}
    </>
  );
}

export default Header;
