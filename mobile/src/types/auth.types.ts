export type UserRole = 'customer' | 'driver' | 'restaurant' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
  purpose: 'registration' | 'password_reset';
  // Registration-only: synced to our DB after InsForge verification
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ExchangeResetCodePayload {
  email: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}
