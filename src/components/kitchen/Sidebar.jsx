/* eslint-disable react-refresh/only-export-components */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ClipboardList,
  Package,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar = ({ stationType = 'kitchen' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const getStationConfig = () => {
    const configs = {
      kitchen: {
        title: 'Kitchen Station',
        icon: '🍳',
        routes: {
          orders: '/staff/kitchen-station',
          stock: '/staff/kitchen-stock'
        }
      },
      bar: {
        title: 'Bar Station',
        icon: '🍹',
        routes: {
          orders: '/staff/bar-station',
          stock: '/staff/bar-stock'
        }
      },
      pastry: {
        title: 'Pastry Station',
        icon: '🧁',
        routes: {
          orders: '/staff/pastry-station',
          stock: '/staff/pastry-stock'
        }
      }
    };
    return configs[stationType] || configs.kitchen;
  };

  const config = getStationConfig();

  const menuItems = [
    {
      path: config.routes.orders,
      label: 'Manajemen Pesanan',
      icon: ClipboardList
    },
    {
      path: config.routes.stock,
      label: 'Manajemen Stok',
      icon: Package
    }
  ];

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      try {
        await logout();
        toast.success('Logout berhasil');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Logout gagal');
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-cream-50 transition-colors lg:hidden"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* 🔥 FIXED: Sidebar dengan struktur sama seperti Owner */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-cream-200 
          transition-transform duration-300 z-40
          flex flex-col
          w-64
          ${isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-2xl">
              {config.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{config.title}</h2>
              <p className="text-sm text-gray-500">Staff Panel</p>
            </div>
          </div>
        </div>

        {/* 🔥 Navigation - dengan flex-1 untuk auto expand */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600 font-semibold' 
                        : 'text-gray-700 hover:bg-cream-50'
                      }
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 🔥 FIXED: Logout - TANPA absolute positioning */}
        <div className="border-t border-cream-200 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;