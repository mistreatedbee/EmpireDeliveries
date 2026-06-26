import axios, { AxiosError } from 'axios';
import { Config } from '@/constants/config';
import {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  OtpPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  ExchangeResetCodePayload,
  User,
  AuthTokens,
} from '@/types/auth.types';
import { parseApiError } from '@/utils/errorHandler';

// InsForge auth API — handles email OTP, login, password reset
const insforgeApi = axios.create({
  baseURL: Config.INSFORGE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

insforgeApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const appError = parseApiError(error);
    if (error instanceof AxiosError && error.response?.data?.error) {
      appError.code = error.response.data.error;
      appError.message = error.response.data.error;
    }
    return Promise.reject(appError);
  }
);

// Direct Express calls with explicit token (bypass the api interceptor during auth)
const expressApi = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

expressApi.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (error) => Promise.reject(parseApiError(error))
);

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  // Register with InsForge — triggers email OTP automatically
  async register(payload: RegisterPayload): Promise<{ requireEmailVerification: boolean }> {
    const { firstName, lastName, email, password } = payload;
    const res = await insforgeApi.post('/api/auth/users?client_type=mobile', {
      email: email.toLowerCase().trim(),
      password,
      name: `${firstName.trim()} ${lastName.trim()}`,
    });
    return { requireEmailVerification: res.data.requireEmailVerification ?? true };
  },

  // Verify 6-digit InsForge OTP; for registration also syncs to our DB
  async verifyOtp({ email, otp, purpose, firstName, lastName, phone, role }: OtpPayload): Promise<AuthResponse> {
    const res = await insforgeApi.post('/api/auth/email/verify?client_type=mobile', { email, otp });
    const { accessToken, refreshToken } = res.data;
    const user = await authService._syncUser(accessToken, { firstName, lastName, email, phone, role });
    return { user, tokens: { accessToken, refreshToken } };
  },

  // Exchange reset OTP code for InsForge reset token (password_reset flow step 1)
  async exchangeResetCode({ email, code }: ExchangeResetCodePayload): Promise<{ token: string }> {
    const res = await insforgeApi.post('/api/auth/email/exchange-reset-password-token', { email, code });
    return { token: res.data.token };
  },

  async login({ email, password }: LoginPayload): Promise<AuthResponse> {
    const res = await insforgeApi.post('/api/auth/sessions?client_type=mobile', {
      email: (email ?? '').toLowerCase().trim(),
      password,
    });
    const { accessToken, refreshToken } = res.data;
    const user = await expressApi.get<never, User>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return { user, tokens: { accessToken, refreshToken } };
  },

  async forgotPassword({ email }: ForgotPasswordPayload): Promise<{ message: string }> {
    await insforgeApi.post('/api/auth/email/send-reset-password', { email: email.toLowerCase() });
    return { message: 'If an account exists, a reset code has been sent to your email.' };
  },

  async resetPassword({ token, newPassword }: ResetPasswordPayload): Promise<{ message: string }> {
    await insforgeApi.post('/api/auth/email/reset-password', { newPassword, otp: token });
    return { message: 'Password reset successfully.' };
  },

  async resendOtp({ email }: ResendOtpPayload): Promise<{ message: string }> {
    await insforgeApi.post('/api/auth/email/send-verification', { email });
    return { message: 'Verification email sent.' };
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const res = await insforgeApi.post('/api/auth/refresh?client_type=mobile', { refreshToken });
    return { accessToken: res.data.accessToken, refreshToken: res.data.refreshToken };
  },

  async logout(): Promise<void> {
    try { await insforgeApi.post('/api/auth/logout'); } catch {}
  },

  async getMe(): Promise<User> {
    // Uses the api interceptor (stored token) — safe for authenticated calls
    const { default: api } = await import('./api');
    const res = await api.get<never, any>('/auth/me');
    return res.data ?? res;
  },

  // Create or return our user record in Express after InsForge verification
  async _syncUser(
    token: string,
    profile: { firstName?: string; lastName?: string; email: string; phone?: string; role?: string }
  ): Promise<User> {
    return expressApi.post<never, User>('/auth/sync', profile, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
