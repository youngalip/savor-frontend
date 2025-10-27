import { createBrowserRouter } from 'react-router-dom'
import CustomerLayout from './components/layout/CustomerLayout'
import MenuPage from './pages/customer/MenuPage'
import CartPage from './pages/customer/CartPage'
import ItemDetailPage from './pages/customer/ItemDetailPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import PaymentSuccessPage from './pages/customer/PaymentSuccessPage'
import OrderHistoryPage from './pages/customer/OrderHistoryPage'

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
  }
])