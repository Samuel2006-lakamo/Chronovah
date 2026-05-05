import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ThemeQuickSwitcher from "../components/ThemeQuickSwitcher";
import { useSidebar } from "../hooks/useSidebar";

function AppLayout() {
  const { isOpen } = useSidebar();
  return (
    <div
      className={` ${
        isOpen ? "md:grid-cols-[260px_1fr]" : " md:grid-cols-[80px_1fr]"
      } min-h-screen grid  dark:bg-gray-950 grid-cols-1 grid-rows-[auto_1fr]`}
    >
      {/* Header */}
      <header className="col-span-full">
        <Header />
      </header>

      {/* Sidebar (hidden on mobile) */}
      <aside className="hidden md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="bg-gray-100 dark:bg-gray-950 p-4 md:p-6 overflow-y-auto">
        <div className=" mx-auto flex flex-col gap-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav
      <div className="md:hidden fixed bottom-0 left-0 w-full">
        <BottomNav />
      </div> */}

      {/* Theme Quick Switcher */}
      <ThemeQuickSwitcher />
    </div>
  );
}

export default AppLayout;
