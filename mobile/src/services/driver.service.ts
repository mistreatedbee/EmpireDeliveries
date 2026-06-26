import api from './api';
import { ApiResponse } from '@/types/api.types';

export interface DriverProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  vehicleType: string;
  vehicleMake?: string;
  vehicleReg?: string;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  totalTrips: number;
  completionRate: number;
  acceptanceRate: number;
  walletBalance: number;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountType?: string;
  bankHolderName?: string;
}

export interface DriverStats {
  earnings: number;
  trips: number;
  acceptanceRate: number;
}

export interface AvailableDelivery {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  itemCount: number;
  payout: number;
  etaMinutes: number;
}

export interface ActiveDelivery extends AvailableDelivery {
  status: string;
  deliveryNotes?: string;
  items: Array<{ name: string; quantity: number }>;
  pickedUpAt?: string;
  restaurantLat?: number | null;
  restaurantLng?: number | null;
  destLat?: number | null;
  destLng?: number | null;
}

export interface DeliveryHistoryItem {
  orderId: string;
  restaurantName: string;
  restaurantLogo: string;
  payout: number;
  deliveredAt: string;
}

export interface EarningsSummary {
  period: string;
  totalEarnings: number;
  tripCount: number;
  hoursWorked: number;
}

export interface DailyBreakdown {
  day: string;
  trips: number;
  earnings: number;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface WalletData {
  balance: number;
  bankAccount?: {
    bankName: string;
    accountNo: string;
    accountType: string;
    holderName: string;
  } | null;
  transactions: WalletTransaction[];
}

export interface DriverDocument {
  id: string;
  type: string;
  referenceNo: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const driverService = {
  async getProfile(): Promise<DriverProfile> {
    const res = await api.get<never, ApiResponse<DriverProfile>>('/drivers/me');
    return res.data;
  },

  async updateProfile(payload: Partial<DriverProfile>): Promise<DriverProfile> {
    const res = await api.put<never, ApiResponse<DriverProfile>>('/drivers/me', payload);
    return res.data;
  },

  async setStatus(online: boolean, lat?: number, lng?: number): Promise<void> {
    await api.post('/drivers/status', { online, lat, lng });
  },

  async getStats(): Promise<DriverStats> {
    const res = await api.get<never, ApiResponse<DriverStats>>('/drivers/stats/today');
    return res.data;
  },

  async getAvailableDelivery(): Promise<AvailableDelivery | null> {
    const res = await api.get<never, ApiResponse<AvailableDelivery | null>>('/drivers/deliveries/available');
    return res.data;
  },

  async getActiveDelivery(): Promise<ActiveDelivery | null> {
    const res = await api.get<never, ApiResponse<ActiveDelivery | null>>('/drivers/deliveries/active');
    return res.data;
  },

  async acceptDelivery(orderId: string): Promise<{ orderId: string; payout: number }> {
    const res = await api.post<never, ApiResponse<{ orderId: string; payout: number }>>(`/drivers/deliveries/${orderId}/accept`);
    return res.data;
  },

  async rejectDelivery(orderId: string): Promise<void> {
    await api.post(`/drivers/deliveries/${orderId}/reject`);
  },

  async pickupDelivery(orderId: string): Promise<{ orderId: string; pickedUpAt: string }> {
    const res = await api.post<never, ApiResponse<{ orderId: string; pickedUpAt: string }>>(`/drivers/deliveries/${orderId}/pickup`);
    return res.data;
  },

  async completeDelivery(orderId: string, photoBase64?: string): Promise<{ orderId: string; payout: number }> {
    const res = await api.post<never, ApiResponse<{ orderId: string; payout: number }>>(
      `/drivers/deliveries/${orderId}/complete`,
      photoBase64 ? { photoBase64 } : {}
    );
    return res.data;
  },

  async getHistory(): Promise<DeliveryHistoryItem[]> {
    const res = await api.get<never, ApiResponse<DeliveryHistoryItem[]>>('/drivers/deliveries/history');
    return res.data;
  },

  async getEarnings(period: 'today' | 'week' | 'month'): Promise<EarningsSummary> {
    const res = await api.get<never, ApiResponse<EarningsSummary>>('/drivers/earnings', { params: { period } });
    return res.data;
  },

  async getEarningsBreakdown(): Promise<DailyBreakdown[]> {
    const res = await api.get<never, ApiResponse<DailyBreakdown[]>>('/drivers/earnings/breakdown');
    return res.data;
  },

  async getWallet(): Promise<WalletData> {
    const res = await api.get<never, ApiResponse<WalletData>>('/drivers/wallet');
    return res.data;
  },

  async requestWithdrawal(amount: number): Promise<{ success: boolean; newBalance: number; message: string }> {
    const res = await api.post<never, ApiResponse<{ success: boolean; newBalance: number; message: string }>>('/drivers/wallet/withdraw', { amount });
    return res.data;
  },

  async updateLocation(lat: number, lng: number): Promise<void> {
    await api.put('/drivers/location', { lat, lng });
  },

  async getDocuments(): Promise<DriverDocument[]> {
    const res = await api.get<never, ApiResponse<DriverDocument[]>>('/drivers/documents');
    return res.data;
  },

  async addDocument(payload: { type: string; referenceNo: string; expiryDate: string }): Promise<DriverDocument> {
    const res = await api.post<never, ApiResponse<DriverDocument>>('/drivers/documents', payload);
    return res.data;
  },

  async deleteDocument(docId: string): Promise<void> {
    await api.delete(`/drivers/documents/${docId}`);
  },
};
