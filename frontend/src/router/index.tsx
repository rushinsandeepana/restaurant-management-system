import { AppLayout } from '@/components/layout/AppLayout'
import { KitchenLayout } from '@/components/layout/KitchenLayout'
import { LoginPage } from '@/features/auth/LoginPage'
import { CategoryPage } from '@/features/categories/CategoryPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { KitchenOrdersPage } from '@/features/kitchen/KitchenOrdersPage'
import { MealPage } from '@/features/meal/MealPage'
import { PlaceholderPage } from '@/features/shared/PlaceholderPage'
import { RoleRoute } from '@/router/RoleRoute'
import { useAuthStore } from '@/store/authStore'
import { Navigate, createBrowserRouter } from 'react-router-dom'

function GuestOnly({ children, redirectTo }: { children: React.ReactNode; redirectTo: string }) {
  const authenticated = useAuthStore((s) => s.isAuthenticated())
  const user = useAuthStore((s) => s.user)
  if (authenticated && user) {
    if (user.role === 'CHEF') return <Navigate to="/kitchen" replace />
    if (user.role === 'CASHIER') return <Navigate to={redirectTo} replace />
  }
  return children
}

export const router = createBrowserRouter([
  { path: '/login', element: <Navigate to="/login/cashier" replace /> },
  {
    path: '/login/cashier',
    element: (
      <GuestOnly redirectTo="/">
        <LoginPage side="cashier" />
      </GuestOnly>
    ),
  },
  {
    path: '/login/kitchen',
    element: (
      <GuestOnly redirectTo="/kitchen">
        <LoginPage side="kitchen" />
      </GuestOnly>
    ),
  },
  {
    element: <RoleRoute allowedRoles={['CASHIER']} loginPath="/login/cashier" />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'menu', element: <PlaceholderPage titleKey="nav.menu" /> },
          { path: 'orders', element: <PlaceholderPage titleKey="nav.orders" /> },
          { path: 'tables', element: <PlaceholderPage titleKey="nav.tables" /> },
          { path: 'kitchen', element: <PlaceholderPage titleKey="nav.kitchen" /> },
          { path: 'categories', element: <CategoryPage /> },
          { path: 'meals', element: <MealPage /> },
          { path: 'staff', element: <PlaceholderPage titleKey="nav.staff" /> },
          { path: 'reservations', element: <PlaceholderPage titleKey="nav.reservations" /> },
          { path: 'billing', element: <PlaceholderPage titleKey="nav.billing" /> },
          { path: 'reports', element: <PlaceholderPage titleKey="nav.reports" /> },
        ],
      },
    ],
  },
  {
    path: 'kitchen',
    element: <RoleRoute allowedRoles={['CHEF']} loginPath="/login/kitchen" />,
    children: [
      {
        element: <KitchenLayout />,
        children: [{ index: true, element: <KitchenOrdersPage /> }],
      },
    ],
  },
  { path: '*', element: <Navigate to="/login/cashier" replace /> },
])
