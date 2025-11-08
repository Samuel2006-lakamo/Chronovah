import { useState, useEffect } from "react";
import { Moon, Sun, Search, Box, Menu } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useSidebar } from "../hooks/useSidebar";

function Header() {
  const {isDarkMode, toggleDarkMode} = useDarkMode();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
const { toggleSidebar } = useSidebar();
 
useEffect(() => {
  const handleScroll = () => {
    // Only enable scroll-hide for mobile/tablet screens
    if (window.innerWidth >= 768) {
      setIsVisible(true);
      return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll); // Re-evaluate when resizing

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  };
}, [lastScrollY]);

  return (
    <header
      className={`flex items-center justify-between px-6 py-3 bg-white dark:bg-[#0B1120] border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Logo / App Name */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hidden md:block hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
        <Box className="w-8 h-8 rounded-xl bg-blue-500 text-gray-800 dark:text-gray-100 tracking-wide" />
        <h1 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-wide">
          Chronova
        </h1>
      </div>

      {/* Search bar */}
      <div className="relative hidden sm:block w-[250px] md:w-[350px]">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-100 dark:bg-[#1E293B] text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-800 transition"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-gray-600 dark:text-gray-300" />
          )}
        </button>

        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer">
          S
        </div>
      </div>
    </header>
  );
}

export default Header;
