import { create } from 'zustand';
import { User } from '@/types/auth.types';
import { storageService } from '@/services/storage.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, refreshToken?: string) => Promise<void>;
  clearAuth: () => Promise<void>;
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
    set({ user, token, refreshToken: refreshToken ?? null, isAuthenticated: true });
  },

  clearAuth: async () => {
    await storageService.clearTokens();
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...partial } });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  hydrate: async () => {
    const token = await storageService.getToken();
    if (token) {
      set({ token, isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
