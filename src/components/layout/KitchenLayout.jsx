import { Outlet } from "react-router-dom";
import Sidebar, { SidebarProvider, useSidebar } from "../../../components/kitchen/Sidebar";

const LayoutContent = ({ stationType }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex bg-cream-50 min-h-screen">
      <Sidebar stationType={stationType} />

      {/* CONTENT SELALU PUNYA MARGIN KETIKA SIDEBAR ADA */}
      <div
        className={`
          flex-1 transition-all duration-300
          ${isCollapsed ? "ml-16" : "ml-64"}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

const KitchenLayout = ({ stationType = "kitchen" }) => (
  <SidebarProvider>
    <LayoutContent stationType={stationType} />
  </SidebarProvider>
);

export default KitchenLayout;
