import api from './api';
import { ApiResponse } from '@/types/api.types';

export interface RestaurantProfile {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  logo?: string;
  coverImage?: string;
  deliveryFee: number;
  minOrder: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  categoryName?: string;
}

export interface RestaurantStats {
  ordersToday: number;
  revenueToday: number;
  avgOrderValue: number;
  activeOrders: number;
}

export interface RestaurantOrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface RestaurantOrder {
  id: string;
  status: string;
  total: number;
  placedAt: string;
  confirmedAt?: string;
  deliveryNotes?: string;
  customerName: string;
  customerPhone: string;
  items: RestaurantOrderItem[];
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  categoryId: string;
  categoryName: string;
}

export interface RestaurantMenuCategory {
  id: string;
  name: string;
  items: RestaurantMenuItem[];
}

export interface MenuItemInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  isAvailable?: boolean;
}

export interface RestaurantAnalytics {
  weeklyData: Array<{ day: string; orders: number; revenue: number }>;
  topItems: Array<{ name: string; orderCount: number }>;
}

export const restaurantManagementService = {
  async getProfile(): Promise<RestaurantProfile> {
    const res = await api.get<never, ApiResponse<RestaurantProfile>>('/restaurant/me');
    return res.data;
  },

  async getStats(): Promise<RestaurantStats> {
    const res = await api.get<never, ApiResponse<RestaurantStats>>('/restaurant/stats');
    return res.data;
  },

  async getOrders(status?: string): Promise<RestaurantOrder[]> {
    const res = await api.get<never, ApiResponse<RestaurantOrder[]>>('/restaurant/orders', {
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  async confirmOrder(id: string): Promise<void> {
    await api.put(`/restaurant/orders/${id}/confirm`);
  },

  async markPreparing(id: string): Promise<void> {
    await api.put(`/restaurant/orders/${id}/preparing`);
  },

  async markReady(id: string): Promise<void> {
    await api.put(`/restaurant/orders/${id}/ready`);
  },

  async getMenu(): Promise<RestaurantMenuCategory[]> {
    const res = await api.get<never, ApiResponse<RestaurantMenuCategory[]>>('/restaurant/menu');
    return res.data;
  },

  async addItem(data: MenuItemInput): Promise<RestaurantMenuItem> {
    const res = await api.post<never, ApiResponse<RestaurantMenuItem>>('/restaurant/menu/items', data);
    return res.data;
  },

  async updateItem(id: string, data: Partial<MenuItemInput>): Promise<RestaurantMenuItem> {
    const res = await api.put<never, ApiResponse<RestaurantMenuItem>>(`/restaurant/menu/items/${id}`, data);
    return res.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/restaurant/menu/items/${id}`);
  },

  async updateProfile(data: { name: string; address: string; deliveryFee: number; minOrder: number }): Promise<Partial<RestaurantProfile>> {
    const res = await api.put<never, ApiResponse<Partial<RestaurantProfile>>>('/restaurant/me', data);
    return res.data;
  },

  async getAnalytics(): Promise<RestaurantAnalytics> {
    const res = await api.get<never, ApiResponse<RestaurantAnalytics>>('/restaurant/analytics');
    return res.data;
  },
};
