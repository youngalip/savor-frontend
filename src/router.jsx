import { createBrowserRouter, Outlet } from "react-router-dom";

// Customer Layout
import CustomerLayout from "./components/layout/CustomerLayout";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import ItemDetailPage from "./pages/customer/ItemDetailPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";

// Auth
import LoginPage from "./pages/auth/LoginPage"; // 🔥 IMPORT
import ProtectedRoute from "./components/auth/ProtectedRoute"; // 🔥 IMPORT
import RoleGuard from "./components/auth/RoleGuard"; // 🔥 IMPORT

// Cashier
import AllOrders from "./pages/staff/cashier/AllOrders";
import ProcessingOrdersCashier from "./pages/staff/cashier/ProcessingOrders";
import ReadyOrders from "./pages/staff/cashier/ReadyOrders";
import CompletedOrders from "./pages/staff/cashier/CompletedOrders";
import { SidebarProvider } from "./components/cashier/Sidebar";

// Kitchen Stations
import KitchenStation from "./pages/staff/kitchen/KitchenStation";
import BarStation from "./pages/staff/kitchen/BarStation";
import PastryStation from "./pages/staff/kitchen/PastryStation";

// Kitchen Stock
import KitchenStockManagement from "./pages/staff/kitchen/KitchenStockManagement";
import BarStockManagement from "./pages/staff/kitchen/BarStockManagement";
import PastryStockManagement from "./pages/staff/kitchen/PastryStockManagement";

import { SidebarProvider as KitchenSidebarProvider } from "./components/kitchen/Sidebar";

// Owner
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CashierMonitor from "./pages/owner/CashierMonitor";
import KitchenMonitor from "./pages/owner/KitchenMonitor";
import SalesReport from "./pages/owner/SalesReport";
import TableManagement from "./pages/owner/TableManagement";
import MenuManagement from "./pages/owner/MenuManagement"; // ADD THIS
import AccountManagement from "./pages/owner/AccountManagement";
import { OwnerSidebarProvider } from "./components/owner/OwnerSidebar";

// ======================
// Layout Wrappers
// ======================
const CashierLayout = () => (
  <SidebarProvider>
    <Outlet />
  </SidebarProvider>
);

const KitchenLayout = () => (
  <KitchenSidebarProvider>
    <Outlet />
  </KitchenSidebarProvider>
);

const OwnerLayout = () => (
  <OwnerSidebarProvider>
    <Outlet />
  </OwnerSidebarProvider>
);

// ======================
// ROUTER FINAL
// ======================
export const router = createBrowserRouter([
  // ==========================
  // 🔥 AUTH ROUTES (Public)
  // ==========================
  {
    path: "/login",
    element: <LoginPage />,
  },

  // ==========================
  // CUSTOMER ROUTES (Public)
  // ==========================
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <MenuPage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "item/:id", element: <ItemDetailPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "payment-success", element: <PaymentSuccessPage /> },
      { path: "order-history", element: <OrderHistoryPage /> },
    ],
  },

  // ==========================
  // 🔒 CASHIER ROUTES (Protected)
  // ==========================
  {
    path: "/staff/cashier",
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['kasir']}>
          <CashierLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AllOrders /> },
      { path: "all-orders", element: <AllOrders /> },
      { path: "processing", element: <ProcessingOrdersCashier /> },
      { path: "ready", element: <ReadyOrders /> },
      { path: "completed", element: <CompletedOrders /> },
    ],
  },

  // ==========================
  // 🔒 KITCHEN ROUTES (Protected)
  // ==========================
  {
    path: "/staff",
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['kitchen', 'bar', 'pastry']}>
          <KitchenLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <KitchenStation /> },
      { path: "kitchen-station", element: <KitchenStation /> },
      { path: "kitchen-stock", element: <KitchenStockManagement /> },

      { path: "bar-station", element: <BarStation /> },
      { path: "bar-stock", element: <BarStockManagement /> },

      { path: "pastry-station", element: <PastryStation /> },
      { path: "pastry-stock", element: <PastryStockManagement /> },
    ],
  },

  // ==========================
  // 🔒 OWNER ROUTES (Protected)
  // ==========================
  {
    path: "/owner",
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['owner']}>
          <OwnerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <OwnerDashboard /> },
      { path: "dashboard", element: <OwnerDashboard /> },
      { path: "cashier-monitor", element: <CashierMonitor /> },
      { path: "kitchen-monitor", element: <KitchenMonitor /> },
      { path: "sales-report", element: <SalesReport /> },
      { path: "table-management", element: <TableManagement /> },
      { path: "menu-management", element: <MenuManagement /> }, // NEW ROUTE
      { path: "account-management", element: <AccountManagement /> },
    ],
  },
]);