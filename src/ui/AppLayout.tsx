import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ThemeQuickSwitcher from "../components/ThemeQuickSwitcher";
import { useSidebar } from "../hooks/useSidebar";
import BottomNav from "../components/BottomNav";
import UpgradeNudge from "../components/UpgradeNudge";
import { useWindowSize } from "../hooks/useWindowSize";

function AppLayout() {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isMd = width >= 768;

  return (
    <div className="min-h-screen bg-default">
      {/* Fixed header — ~60px tall */}
      <Header />

      {/* Fixed sidebar — desktop only */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content
          pt-[60px] clears the fixed header.
          On desktop, marginLeft tracks the sidebar width with the same
          transition timing as the sidebar itself.
      */}
      <div
        className="bg-default min-h-screen pt-[20px] sm:pt-[40px] md:pt-[60px] "
        style={{
        
          marginLeft: isMd ? (isOpen ? "260px" : "72px") : "0px",
          transition: "margin-left 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40">
        <BottomNav />
      </div>

      <ThemeQuickSwitcher />
      <UpgradeNudge />
    </div>
  );
}

export default AppLayout;
