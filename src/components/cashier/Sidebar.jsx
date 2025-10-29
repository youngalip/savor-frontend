import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle, 
  Archive,
  Menu,
  X
} from 'lucide-react';
import { createContext, useContext, useState } from 'react';

// Context untuk Sidebar
const SidebarContext = createContext();

// Hook untuk menggunakan Sidebar Context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

// Provider Component
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const menuItems = [
    {
      path: '/staff/cashier/all-orders',
      label: 'Semua Pesanan',
      icon: LayoutDashboard
    },
    {
      path: '/staff/cashier/processing',
      label: 'Pesanan Diproses',
      icon: Clock
    },
    {
      path: '/staff/cashier/ready',
      label: 'Pesanan Siap',
      icon: CheckCircle
    },
    {
      path: '/staff/cashier/completed',
      label: 'Pesanan Selesai',
      icon: Archive
    }
  ];

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-cream-50 transition-colors"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        w-64 bg-white border-r border-cream-200 min-h-screen fixed left-0 top-0 z-40
        transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-6 border-b border-cream-200 mt-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Safor Bakery</h2>
              <p className="text-sm text-gray-500">Kasir Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-500 font-semibold' 
                        : 'text-gray-600 hover:bg-cream-50'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cream-200">
          <button className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-cream-50 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Overlay - hanya muncul di mobile ketika sidebar terbuka */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;