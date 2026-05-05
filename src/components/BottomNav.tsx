import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import navItems from "../type/navItems";

function BottomNav() {
  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex justify-around items-center bg-card/95 backdrop-blur-md rounded-2xl border border-default py-2 mx-4 mb-3 shadow-soft dark:shadow-none"
    >
      {navItems.map(({ name, icon: Icon, path }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `group flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
              isActive
                ? "text-primary-500 bg-primary-500/10"
                : "text-muted hover:text-primary-500 hover:bg-default"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Icon with subtle scale on active */}
              <motion.div whileTap={{ scale: 0.9 }} className="relative">
                <Icon
                  size={22}
                  className={isActive ? "text-primary-500" : "text-muted"}
                />

                {/* Small indicator dot for active state */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Label - always visible on mobile, tooltip on desktop */}
            

              {/* Desktop tooltip */}
              <span
                className="
                absolute -top-8 left-1/2 -translate-x-1/2
                bg-card border border-default text-primary text-[10px] font-medium
                rounded-md px-2 py-1
                opacity-0 group-hover:opacity-100 group-hover:-translate-y-1
                transition-all duration-200 pointer-events-none
                whitespace-nowrap shadow-soft
                hidden md:block
              "
              >
                {name}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </motion.nav>
  );
}

export default BottomNav;
