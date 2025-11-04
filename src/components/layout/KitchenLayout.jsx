import { Outlet } from 'react-router-dom';
import KitchenSidebar, { KitchenSidebarProvider, useSidebar } from '../kitchen/Sidebar';

const KitchenLayoutContent = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-cream-50">
      <KitchenSidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <Outlet />
      </div>
    </div>
  );
};

const KitchenLayout = ({ stationType = 'kitchen' }) => {
  return (
    <KitchenSidebarProvider stationType={stationType}>
      <KitchenLayoutContent />
    </KitchenSidebarProvider>
  );
};

export default KitchenLayout;