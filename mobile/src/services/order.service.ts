import api from './api';
import {
  Order,
  CreateOrderPayload,
  TrackingUpdate,
  CouponValidation,
} from '@/types/order.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const orderService = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const res = await api.post<never, ApiResponse<Order>>('/orders', payload);
    return res.data;
  },

  async getList(status?: string, page = 1): Promise<PaginatedResponse<Order>> {
    return api.get('/orders', { params: { status, page } });
  },

  async getById(id: string): Promise<Order> {
    const res = await api.get<never, ApiResponse<Order>>(`/orders/${id}`);
    return res.data;
  },

  async getTracking(id: string): Promise<TrackingUpdate> {
    const res = await api.get<never, ApiResponse<TrackingUpdate>>(`/orders/${id}/tracking`);
    return res.data;
  },

  async cancel(id: string, reason?: string): Promise<Order> {
    const res = await api.post<never, ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    return res.data;
  },

  async rate(id: string, rating: number, review?: string): Promise<Order> {
    const res = await api.post<never, ApiResponse<Order>>(`/orders/${id}/rate`, { rating, review });
    return res.data;
  },

  async validateCoupon(code: string): Promise<CouponValidation> {
    const res = await api.get<never, ApiResponse<CouponValidation>>('/coupons/validate', { params: { code } });
    return res.data;
  },
};
