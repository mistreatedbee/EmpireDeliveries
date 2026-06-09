import { Platform } from 'react-native';
import api from './api';
import { Notification } from '@/types/notification.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const notificationService = {
  async getList(page = 1): Promise<PaginatedResponse<Notification>> {
    return api.get('/notifications', { params: { page } });
  },

  async markRead(id: string): Promise<Notification> {
    const res = await api.put<never, ApiResponse<Notification>>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead(): Promise<void> {
    await api.put('/notifications/read-all');
  },

  async registerToken(token: string): Promise<void> {
    await api.post('/notifications/token', { token, platform: Platform.OS });
  },

  async unregisterToken(token: string): Promise<void> {
    await api.delete(`/notifications/token/${token}`);
  },
};
