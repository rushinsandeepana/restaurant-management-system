import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse, User } from '@/types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setAuth: (response: AuthResponse) => void
  setUser: (user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (response) =>
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        }),
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
      isAuthenticated: () => !!get().accessToken,
    }),
    { name: 'rms-auth' },
  ),
)
