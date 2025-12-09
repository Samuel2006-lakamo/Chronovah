

import { NavLink } from "react-router-dom";

import navItems from "../type/navItems";
import { useSidebar } from "../hooks/useSidebar";


function Sidebar() {

  const { isOpen } = useSidebar();

  return (
    <aside
      className={`${
        isOpen ? "w-[260px]" : "w-[80px]"
      } bg-white dark:bg-[#0B1120] border-r top-15 border-t-0 fixed left-0 bottom-0 border-gray-200 dark:border-gray-700 min-h-screen flex flex-col transition-all duration-300`}
    >
     
    

      {/* Navigation */}
      <nav className="flex-1 flex flex-col mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-lg mx-3 my-1 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800 ${
                isActive
                  ? "bg-blue-500 text-white hover:bg-blue-500  dark:bg-blue-600"
                  : "text-gray-600"
              }`
            }
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto mb-20 text-center text-xs text-gray-500 dark:text-gray-400">
        {isOpen && "© 2025 LifePanel"}
      </div>
    </aside>
  );
}

export default Sidebar;
