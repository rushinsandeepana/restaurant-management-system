import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return {
    user,
    accessToken,
    clearAuth,
    isAuthenticated: isAuthenticated(),
    hasRole: (...roles: string[]) =>
      user ? roles.includes(user.role) : false,
  }
}
