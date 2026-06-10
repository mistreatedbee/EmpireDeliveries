import api from './api';
import { ApiResponse } from '@/types/api.types';

export interface BackendAddress {
  id: string;
  label: string;
  street: string;
  suburb: string | null;
  city: string;
  province: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressPayload {
  label?: string;
  street: string;
  suburb?: string;
  city: string;
  province?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export const userService = {
  async getAddresses(): Promise<BackendAddress[]> {
    const res = await api.get<never, ApiResponse<BackendAddress[]>>('/users/addresses');
    return res.data;
  },

  async createAddress(payload: CreateAddressPayload): Promise<BackendAddress> {
    const res = await api.post<never, ApiResponse<BackendAddress>>('/users/addresses', payload);
    return res.data;
  },

  async deleteAddress(id: string): Promise<void> {
    await api.delete(`/users/addresses/${id}`);
  },

  async setDefaultAddress(id: string): Promise<BackendAddress> {
    const res = await api.put<never, ApiResponse<BackendAddress>>(`/users/addresses/${id}/default`);
    return res.data;
  },

  async updateProfile(payload: { firstName: string; lastName: string; phone?: string; profileImage?: string }) {
    const res = await api.put<never, ApiResponse<unknown>>('/users/profile', payload);
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/users/change-password', { currentPassword, newPassword });
  },

  async getFavourites() {
    const res = await api.get<never, ApiResponse<unknown[]>>('/users/favourites');
    return res.data;
  },
};
