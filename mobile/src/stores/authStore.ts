import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { User } from '@/types/auth.types';
import { storageService } from '@/services/storage.service';
import { notificationService } from '@/services/notification.service';

const USER_KEY = 'empire_user';

let _pushToken: string | null = null;

async function registerPushToken() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    const projectId =
      (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
      (Constants.easConfig?.projectId as string | undefined);
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: projectId ?? undefined })).data;
    _pushToken = token;
    await notificationService.registerToken(token);
  } catch { /* non-fatal */ }
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
    set({ user, token, refreshToken: refreshToken ?? null, isAuthenticated: true });
    void registerPushToken();
  },

  clearAuth: async () => {
    void unregisterPushToken();
    await storageService.clearTokens();
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  logout: async () => {
    void unregisterPushToken();
    await storageService.clearTokens();
    await AsyncStorage.removeItem(USER_KEY);
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
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
    const [token, raw] = await Promise.all([
      storageService.getToken(),
      AsyncStorage.getItem(USER_KEY),
    ]);
    if (token) {
      const user = raw ? (JSON.parse(raw) as User) : null;
      set({ token, user, isAuthenticated: true, isLoading: false });
      void registerPushToken();
    } else {
      set({ isLoading: false });
    }
  },
}));
