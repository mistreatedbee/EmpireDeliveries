import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/auth.types';
import { storageService } from '@/services/storage.service';
import { notificationService } from '@/services/notification.service';
import { setInsforgeSessionToken } from '@/lib/insforgeClient';

const USER_KEY = 'empire_user';

let _pushToken: string | null = null;

async function registerPushToken() {
  try {
    const { registerForPushNotifications } = await import('@/lib/notifications');
    const token = await registerForPushNotifications();
    if (!token) return;
    _pushToken = token;
    await notificationService.registerToken(token);
  } catch {
    /* push is optional — must not block auth */
  }
}

async function unregisterPushToken() {
  if (!_pushToken) return;
  try {
    await notificationService.unregisterToken(_pushToken);
    _pushToken = null;
  } catch { /* non-fatal */ }
}

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => Promise<void>;
  clearAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token, refreshToken) => {
    await storageService.setToken(token);
    if (refreshToken) await storageService.setRefreshToken(refreshToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user, token, refreshToken: refreshToken ?? null, isAuthenticated: true, isLoading: false });
    setInsforgeSessionToken(token);
    void registerPushToken();
  },

  clearAuth: async () => {
    void unregisterPushToken();
    await storageService.clearTokens();
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    setInsforgeSessionToken(null);
  },

  logout: async () => {
    void unregisterPushToken();
    await storageService.clearTokens();
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    setInsforgeSessionToken(null);
  },

  updateUser: (partial) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...partial };
      set({ user: updated });
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updated)).catch(() => null);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  hydrate: async () => {
    const [token, refreshToken, raw] = await Promise.all([
      storageService.getToken(),
      storageService.getRefreshToken(),
      AsyncStorage.getItem(USER_KEY),
    ]);
    if (token) {
      const user = raw ? (JSON.parse(raw) as User) : null;
      set({ token, refreshToken, user, isAuthenticated: true, isLoading: false });
      setInsforgeSessionToken(token);
      void registerPushToken();
    } else {
      set({ isLoading: false });
    }
  },
}));
