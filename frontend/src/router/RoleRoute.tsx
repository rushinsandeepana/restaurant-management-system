import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/types/auth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface RoleRouteProps {
  allowedRoles: Role[]
  loginPath: string
}

export function RoleRoute({ allowedRoles, loginPath }: RoleRouteProps) {
  const authenticated = useAuthStore((s) => s.isAuthenticated())
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === 'CHEF') return <Navigate to="/kitchen" replace />
    if (user?.role === 'CASHIER') return <Navigate to="/" replace />
    return <Navigate to={loginPath} replace />
  }

  return <Outlet />
}
