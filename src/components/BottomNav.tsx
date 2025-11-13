import { NavLink } from "react-router-dom";
import navItems from "../type/navItems";

function BottomNav() {
  return (
    <nav className="flex justify-around items-center bg-white dark:bg-[#0B1120] rounded-full border-t border-gray-200 dark:border-gray-700 py-4  mx-6 mb-2 shadow-md">
      {navItems.map(({ name, icon: Icon, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `group flex flex-col items-center py-2 px-2 text-xs relative transition ${
              isActive ? "text-blue-500 bg-blue-200 rounded-full" : "text-gray-500 dark:text-gray-400"
            }`
          }
        >
          <Icon size={22} />
          {/* Tooltip-like label */}
          <span
            className="absolute bottom-8 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2
             bg-gray-800 text-white text-[10px] font-medium rounded px-2 py-1 transition-all duration-200"
          >
            {name}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
