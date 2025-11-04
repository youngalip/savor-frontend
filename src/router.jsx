import { createBrowserRouter, Outlet } from "react-router-dom";
import CustomerLayout from "./components/layout/CustomerLayout";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import ItemDetailPage from "./pages/customer/ItemDetailPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import PaymentSuccessPage from "./pages/customer/PaymentSuccessPage";
import OrderHistoryPage from "./pages/customer/OrderHistoryPage";

// Cashier
import AllOrders from "./pages/staff/cashier/AllOrders";
import ProcessingOrdersCashier from "./pages/staff/cashier/ProcessingOrders";
import ReadyOrders from "./pages/staff/cashier/ReadyOrders";
import CompletedOrders from "./pages/staff/cashier/CompletedOrders";
import { SidebarProvider } from "./components/cashier/Sidebar";

// Kitchen Stations - Orders
import KitchenStation from "./pages/staff/kitchen/KitchenStation";
import BarStation from "./pages/staff/kitchen/BarStation";
import PastryStation from "./pages/staff/kitchen/PastryStation";

// Kitchen Stations - Stock Management
import KitchenStockManagement from "./pages/staff/kitchen/KitchenStockManagement";
import BarStockManagement from "./pages/staff/kitchen/BarStockManagement";
import PastryStockManagement from "./pages/staff/kitchen/PastryStockManagement";

// Kitchen Sidebar Provider
import { SidebarProvider as KitchenSidebarProvider } from "./components/kitchen/Sidebar";

// Wrapper component untuk Cashier routes
const CashierLayout = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

// Wrapper component untuk Kitchen routes
const KitchenLayout = () => {
  return (
    <KitchenSidebarProvider>
      <Outlet />
    </KitchenSidebarProvider>
  );
};

export const router = createBrowserRouter([
  // Customer Routes
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <MenuPage />,
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "item/:id",
        element: <ItemDetailPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "order-history",
        element: <OrderHistoryPage />,
      },
    ],
  },

  // Cashier Routes
  {
    path: "/staff/cashier",
    element: <CashierLayout />,
    children: [
      {
        index: true,
        element: <AllOrders />,
      },
      {
        path: "all-orders",
        element: <AllOrders />,
      },
      {
        path: "processing",
        element: <ProcessingOrdersCashier />,
      },
      {
        path: "ready",
        element: <ReadyOrders />,
      },
      {
        path: "completed",
        element: <CompletedOrders />,
      },
    ],
  },

  // Kitchen Routes
  {
    path: "/staff",
    element: <KitchenLayout />,
    children: [
      {
        index: true,
        element: <KitchenStation />,
      },
      {
        path: "kitchen-station",
        element: <KitchenStation />,
      },
      {
        path: "kitchen-stock",
        element: <KitchenStockManagement />,
      },
      {
        path: "bar-station",
        element: <BarStation />,
      },
      {
        path: "bar-stock",
        element: <BarStockManagement />,
      },
      {
        path: "pastry-station",
        element: <PastryStation />,
      },
      {
        path: "pastry-stock",
        element: <PastryStockManagement />,
      },
    ],
  },
]);