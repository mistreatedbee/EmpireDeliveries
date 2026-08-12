import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Config } from '@/constants/config';
import { storageService } from './storage.service';
import { parseApiError } from '@/utils/errorHandler';
import { authService } from './auth.service';

let authStoreRef: {
  getState: () => { token: string | null; refreshToken: string | null; setAuth: (user: any, token: string, refresh?: string) => Promise<void>; clearAuth: () => void; user: any };
} | null = null;

export function injectAuthStore(store: typeof authStoreRef) {
  authStoreRef = store;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = authStoreRef?.getState().refreshToken ?? (await storageService.getRefreshToken());
    if (!refreshToken) return null;
    try {
      const tokens = await authService.refreshToken(refreshToken);
      await storageService.setToken(tokens.accessToken);
      if (tokens.refreshToken) await storageService.setRefreshToken(tokens.refreshToken);
      const state = authStoreRef?.getState();
      if (state?.user) {
        await state.setAuth(state.user, tokens.accessToken, tokens.refreshToken);
      }
      return tokens.accessToken;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const api: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = authStoreRef?.getState().token ?? (await storageService.getToken());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(parseApiError(error)),
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const appError = parseApiError(error);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (appError.statusCode === 401 && originalRequest && !originalRequest._retry) {
      const requestUrl = String(originalRequest.url ?? '');
      const skipLogout =
        requestUrl.includes('/notifications/token') ||
        requestUrl.includes('/orders/quote');

      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
      if (!skipLogout) {
        authStoreRef?.getState().clearAuth();
        await storageService.clearTokens();
        router.replace('/(auth)/login');
      }
    }

    return Promise.reject(appError);
  },
);

export default api;
