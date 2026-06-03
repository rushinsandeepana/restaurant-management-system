export type Role = 'ADMIN' | 'MANAGER' | 'WAITER' | 'CHEF' | 'CASHIER'

export interface User {
  id: number
  email: string
  fullName: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}
