import { useState, createContext, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Receipt,
  ChefHat,
  BarChart3,
  Users,
  UtensilsCrossed,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const OwnerSidebarContext = createContext();

export const useOwnerSidebar = () => {
  const context = useContext(OwnerSidebarContext);
  if (!context) {
    throw new Error('useOwnerSidebar must be used within OwnerSidebarProvider');
  }
  return context;
};

export const OwnerSidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <OwnerSidebarContext.Provider 
      value={{ 
        isCollapsed, 
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen
      }}
    >
      {children}
    </OwnerSidebarContext.Provider>
  );
};

const OwnerSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useOwnerSidebar();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/owner/dashboard',
    },
    {
      name: 'Laporan Penjualan',
      icon: BarChart3,
      path: '/owner/sales-report',
    },
    {
      name: 'Manajemen Meja',
      icon: UtensilsCrossed,
      path: '/owner/table-management',
    },
    {
      name: 'Manajemen Menu',
      icon: UtensilsCrossed,
      path: '/owner/menu-management',
    },
    {
      name: 'Manajemen Akun',
      icon: Users,
      path: '/owner/account-management',
    },
  ];

  const handleLogout = async () => {
    toast.loading('Sedang logout...', { id: 'logout' });

    try {
      await logout();
      toast.success('Logout berhasil', { id: 'logout' });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout gagal', { id: 'logout' });
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-cream-200"
      >
        <Menu size={24} className="text-gray-900" />
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-cream-200 
          transition-all duration-300 z-50
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-cream-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-sm">Owner Panel</h1>
                <p className="text-xs text-gray-500">Restaurant Management</p>
              </div>
            </div>
          )}
          
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-1 hover:bg-cream-50 rounded"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-cream-50 rounded transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600 font-semibold'
                          : 'text-gray-700 hover:bg-cream-50'
                      } ${isCollapsed ? 'justify-center' : ''}`
                    }
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.name}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-cream-200 p-3">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
              text-red-600 hover:bg-red-50 w-full
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default OwnerSidebar;