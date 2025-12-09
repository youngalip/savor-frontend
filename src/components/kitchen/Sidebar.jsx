/* eslint-disable react-refresh/only-export-components */
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, Package, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { createContext, useContext, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// ================= CONTEXT ==================
const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// ================= SIDEBAR ==================
const Sidebar = ({ stationType = "kitchen" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();

  const stationConfig = {
    kitchen: {
      title: "Kitchen Station",
      icon: "🍳",
      routes: { orders: "/staff/kitchen-station", stock: "/staff/kitchen-stock" }
    },
    bar: {
      title: "Bar Station",
      icon: "🍹",
      routes: { orders: "/staff/bar-station", stock: "/staff/bar-stock" }
    },
    pastry: {
      title: "Pastry Station",
      icon: "🧁",
      routes: { orders: "/staff/pastry-station", stock: "/staff/pastry-stock" }
    }
  };

  const config = stationConfig[stationType] ?? stationConfig.kitchen;

  const menuItems = [
    { path: config.routes.orders, label: "Manajemen Pesanan", icon: ClipboardList },
    { path: config.routes.stock, label: "Manajemen Stok", icon: Package }
  ];

  const handleLogout = async () => {
    toast.loading("Sedang logout...", { id: "logout" });

    try {
      await logout();
      toast.success("Logout berhasil", { id: "logout" });
      navigate("/login");
    } catch {
      toast.error("Logout gagal", { id: "logout" });
    }
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 bg-white border-r shadow-sm
        flex flex-col transition-all duration-300
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >

      {/* === TOGGLE BUTTON — DI TENGAH === */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          absolute -right-3 top-1/2 -translate-y-1/2 
          bg-white border rounded-full shadow p-1 z-50 hover:bg-gray-100
        "
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* HEADER */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 text-white rounded-lg flex items-center justify-center text-xl">
            {config.icon}
          </div>

          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-gray-900">{config.title}</h2>
              <p className="text-sm text-gray-500">Staff Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto mt-4 px-2">
        {menuItems.map((item) => {
          const Active = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg mb-1
                transition-colors
                ${Active ? "bg-primary-50 text-primary-600" : "hover:bg-gray-100 text-gray-700"}
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-3 py-3 rounded-lg w-full"
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Keluar</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
