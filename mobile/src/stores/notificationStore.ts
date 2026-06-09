import { create } from 'zustand';

interface NotificationStore {
  pushToken: string | null;
  unreadCount: number;
  setPushToken: (token: string) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  pushToken: null,
  unreadCount: 0,

  setPushToken: (token) => set({ pushToken: token }),

  incrementUnread: () => set({ unreadCount: get().unreadCount + 1 }),

  clearUnread: () => set({ unreadCount: 0 }),
}));
