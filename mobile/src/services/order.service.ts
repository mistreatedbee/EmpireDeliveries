import api from './api';
import {
  Order,
  CreateOrderPayload,
  TrackingUpdate,
  CouponValidation,
  OrderQuote,
  OrderQuotePayload,
} from '@/types/order.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { normalizeOrder, normalizeTrackingUpdate } from '@/utils/normalizeOrder';

export const orderService = {
  async getQuote(payload: OrderQuotePayload): Promise<OrderQuote> {
    const res = await api.post<never, ApiResponse<OrderQuote>>('/orders/quote', payload);
    return res.data;
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const res = await api.post<never, ApiResponse<Order>>('/orders', payload);
    return normalizeOrder(res.data as unknown as Record<string, unknown>);
  },

  async getList(status?: string, page = 1): Promise<PaginatedResponse<Order>> {
    const res = await api.get<never, ApiResponse<Record<string, unknown>[]>>('/orders', { params: { status, page } });
    const rows = res.data ?? [];
    return {
      success: res.success,
      data: rows.map((row) => normalizeOrder(row)),
      pagination: {
        page: 1,
        limit: rows.length,
        total: rows.length,
        totalPages: 1,
      },
    };
  },

  async getById(id: string): Promise<Order> {
    const res = await api.get<never, ApiResponse<Record<string, unknown>>>(`/orders/${id}`);
    return normalizeOrder(res.data);
  },

  async getPaymentStatus(id: string): Promise<{ orderId: string; paymentStatus: string; status: string; paymentMethod?: string }> {
    const res = await api.get<never, ApiResponse<{ orderId: string; paymentStatus: string; status: string; paymentMethod?: string }>>(
      `/orders/${id}/payment-status`,
    );
    return res.data;
  },

  async getTracking(id: string): Promise<TrackingUpdate> {
    const res = await api.get<never, ApiResponse<Record<string, unknown>>>(`/orders/${id}/tracking`);
    return normalizeTrackingUpdate(res.data, id);
  },

  async cancel(id: string, reason?: string): Promise<Order> {
    const res = await api.post<never, ApiResponse<Record<string, unknown>>>(`/orders/${id}/cancel`, { reason });
    return normalizeOrder(res.data);
  },

  async updateDeliveryNotes(id: string, deliveryNotes: string): Promise<Order> {
    const res = await api.patch<never, ApiResponse<Record<string, unknown>>>(`/orders/${id}/notes`, { deliveryNotes });
    return normalizeOrder(res.data);
  },

  async rate(
    id: string,
    payload: {
      rating: number;
      review?: string;
      driverRating?: number;
      driverReview?: string;
      tipAmount?: number;
    },
  ): Promise<Order> {
    const res = await api.post<never, ApiResponse<Record<string, unknown>>>(`/orders/${id}/rate`, payload);
    return normalizeOrder(res.data);
  },

  async validateCoupon(code: string): Promise<CouponValidation> {
    const res = await api.get<never, ApiResponse<CouponValidation>>('/coupons/validate', { params: { code } });
    return res.data;
  },
};
