import { createBrowserRouter, Outlet } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import MenuPage from './pages/customer/MenuPage'
import CartPage from './pages/customer/CartPage'
import ItemDetailPage from './pages/customer/ItemDetailPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import PaymentSuccessPage from './pages/customer/PaymentSuccessPage'
import OrderHistoryPage from './pages/customer/OrderHistoryPage'
//Cashier
import AllOrders from './pages/staff/cashier/AllOrders';
import ProcessingOrders from './pages/staff/cashier/ProcessingOrders';
import ReadyOrders from './pages/staff/cashier/ReadyOrders';
import CompletedOrders from './pages/staff/cashier/CompletedOrders';
import { SidebarProvider } from './components/cashier/Sidebar';

// Wrapper component untuk Cashier routes dengan SidebarProvider
const CashierLayout = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <MenuPage /> // MenuPage is now the homepage
      },
      {
        path: 'menu',
        element: <MenuPage /> // Also available at /menu for consistency
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'item/:id',
        element: <ItemDetailPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'payment-success',
        element: <PaymentSuccessPage />
      },
      {
        path: 'order-history',
        element: <OrderHistoryPage />
      }
    ]
  },
  {
    path: '/staff/cashier',
    element: <CashierLayout />,
    children: [
      {
        index: true,
        element: <AllOrders />
      },
      {
        path: 'all-orders',
        element: <AllOrders />
      },
      {
        path: 'processing',
        element: <ProcessingOrders />
      },
      {
        path: 'ready',
        element: <ReadyOrders />
      },
      {
        path: 'completed',
        element: <CompletedOrders />
      }
    ]
  }
])