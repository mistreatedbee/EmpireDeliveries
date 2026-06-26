import api from './api';
import { ApiResponse } from '@/types/api.types';

export interface AdminStats {
  users: { total: number; customers: number; drivers: number; restaurants: number; pendingApproval: number };
  orders: { today: number; revenueToday: number };
  pendingDriverApplications: number;
  pendingRestaurantApplications: number;
}

export interface Application {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
  applicationType: 'driver' | 'restaurant';
  // driver-specific
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleReg?: string;
  idNumber?: string;
  dateOfBirth?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankHolder?: string;
  // restaurant-specific
  tradingName?: string;
  businessRegNo?: string;
  cuisineType?: string;
  address?: string;
  city?: string;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  approvalStatus: string;
  isVerified: boolean;
  createdAt: string;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get<never, ApiResponse<AdminStats>>('/admin/stats');
    return res.data;
  },

  async getApplications(params?: { type?: string; status?: string }): Promise<Application[]> {
    const res = await api.get<never, ApiResponse<Application[]>>('/admin/applications', { params });
    return res.data;
  },

  async getApplication(id: string, type?: string): Promise<Application> {
    const res = await api.get<never, ApiResponse<Application>>(`/admin/applications/${id}`, { params: { type } });
    return res.data;
  },

  async approveApplication(id: string, type: 'driver' | 'restaurant'): Promise<void> {
    await api.put(`/admin/applications/${id}/approve`, { type });
  },

  async rejectApplication(id: string, type: 'driver' | 'restaurant', reason?: string): Promise<void> {
    await api.put(`/admin/applications/${id}/reject`, { type, reason });
  },

  async getUsers(params?: { search?: string; role?: string; status?: string; page?: number }): Promise<{ data: AdminUser[]; total: number }> {
    const res = await api.get<never, ApiResponse<{ data: AdminUser[]; total: number }>>('/admin/users', { params });
    return res.data;
  },

  async suspendUser(id: string, reason?: string): Promise<void> {
    await api.put(`/admin/users/${id}/suspend`, { reason });
  },

  async reactivateUser(id: string): Promise<void> {
    await api.put(`/admin/users/${id}/reactivate`);
  },
};

export const applicationsService = {
  async getMyApplication() {
    const res = await api.get<never, ApiResponse<unknown>>('/applications/me');
    return res.data;
  },

  async submitDriverApplication(data: {
    idNumber?: string;
    dateOfBirth?: string;
    vehicleType?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleReg?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankHolder?: string;
    bankBranch?: string;
    idDocumentUrl?: string;
    driversLicenseUrl?: string;
    vehicleRegistrationUrl?: string;
  }) {
    await api.post('/applications/driver', data);
  },

  async submitRestaurantApplication(data: {
    tradingName: string;
    businessRegNo?: string;
    cuisineType?: string;
    address?: string;
    city?: string;
    description?: string;
    operatingHours?: string;
    minOrder?: string;
    deliveryFee?: string;
    deliveryRadius?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankHolder?: string;
    businessDocUrl?: string;
  }) {
    await api.post('/applications/restaurant', data);
  },
};
