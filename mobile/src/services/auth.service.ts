import api from './api';
import {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  OtpPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  AuthTokens,
} from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<never, ApiResponse<AuthResponse>>('/auth/login', payload);
    return res.data;
  },

  async register(payload: RegisterPayload): Promise<{ message: string }> {
    const res = await api.post<never, ApiResponse<{ message: string }>>('/auth/register', payload);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getMe(): Promise<User> {
    const res = await api.get<never, ApiResponse<User>>('/auth/me');
    return res.data;
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const res = await api.post<never, ApiResponse<{ message: string }>>('/auth/forgot-password', payload);
    return res.data;
  },

  async verifyOtp(payload: OtpPayload): Promise<AuthResponse> {
    const res = await api.post<never, ApiResponse<AuthResponse>>('/auth/verify-otp', payload);
    return res.data;
  },

  async resendOtp(payload: ResendOtpPayload): Promise<{ message: string }> {
    const res = await api.post<never, ApiResponse<{ message: string }>>('/auth/resend-otp', payload);
    return res.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const res = await api.post<never, ApiResponse<{ message: string }>>('/auth/reset-password', payload);
    return res.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const res = await api.post<never, ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    return res.data;
  },
};
