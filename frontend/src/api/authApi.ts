import type { AuthResponse, LoginRequest, User } from '@/types/auth'
import { apiClient } from './client'

export const authApi = {
  login: (body: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', body).then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post('/api/auth/logout', { refreshToken }),

  me: () => apiClient.get<User>('/api/auth/me').then((r) => r.data),
}
