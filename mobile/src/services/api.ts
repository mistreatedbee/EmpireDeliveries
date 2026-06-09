import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { Config } from '@/constants/config';
import { storageService } from './storage.service';
import { parseApiError } from '@/utils/errorHandler';

let authStoreRef: { getState: () => { token: string | null; clearAuth: () => void } } | null = null;

export function injectAuthStore(store: typeof authStoreRef) {
  authStoreRef = store;
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
  (error) => {
    const appError = parseApiError(error);
    if (appError.statusCode === 401) {
      authStoreRef?.getState().clearAuth();
      storageService.clearTokens();
      router.replace('/(auth)/login');
    }
    return Promise.reject(appError);
  },
);

export default api;
