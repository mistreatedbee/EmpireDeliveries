import api from './api';
import { ApiResponse } from '@/types/api.types';
import { normalizeApplication, normalizeApplications } from '@/utils/normalizeApplication';

export interface AdminStats {
  users: { total: number; customers: number; drivers: number; restaurants: number; pendingApproval: number };
  orders: { today: number; revenueToday: number };
  pendingDriverApplications: number;
  pendingRestaurantApplications: number;
  pendingWithdrawals: number;
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
  incompleteSignup?: boolean;
  idDocumentUrl?: string;
  driversLicenseUrl?: string;
  vehicleRegistrationUrl?: string;
  vehiclePhotoUrl?: string;
  licensePlatePhotoUrl?: string;
  businessDocUrl?: string;
  // driver-specific
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleReg?: string;
  vehicleColour?: string;
  idNumber?: string;
  dateOfBirth?: string;
  yearsExperience?: number;
  prdpNumber?: string;
  prdpExpiry?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  criminalRecordConsent?: boolean;
  bankName?: string;
  bankAccountNo?: string;
  bankHolder?: string;
  bankAccountType?: string;
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

export interface WithdrawalRequest {
  id: string;
  entityType: 'driver' | 'restaurant';
  driverId?: string | null;
  restaurantId?: string | null;
  amount: number;
  status: string;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankAccountType?: string | null;
  bankHolderName?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  requesterName?: string | null;
  requesterEmail?: string | null;
  requesterPhone?: string | null;
  businessName?: string | null;
}

export interface AdminDriverOverview {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  approvalStatus: string;
  walletBalance: number;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  tripsToday: number;
  earningsToday: number;
  earningsTotal: number;
  pendingWithdrawal?: number | null;
  pendingWithdrawalId?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankHolderName?: string | null;
}

export interface AdminRestaurantOverview {
  id: string;
  name: string;
  address?: string;
  isActive: boolean;
  walletBalance: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  approvalStatus: string;
  ordersToday: number;
  revenueToday: number;
  ordersTotal: number;
  pendingWithdrawal?: number | null;
  pendingWithdrawalId?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankHolderName?: string | null;
}

export interface AdminCustomerOverview {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  approvalStatus: string;
  walletBalance: number;
  ordersTotal: number;
  ordersToday: number;
  spentTotal: number;
  createdAt: string;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await api.get<never, ApiResponse<AdminStats>>('/admin/stats');
    return res.data;
  },

  async getApplications(params?: { type?: string; status?: string }): Promise<Application[]> {
    const res = await api.get<never, ApiResponse<Application[]>>('/admin/applications', { params });
    return normalizeApplications(res.data as unknown as Record<string, unknown>[]) as unknown as Application[];
  },

  async getApplication(id: string, type?: string): Promise<Application> {
    const res = await api.get<never, ApiResponse<Application>>(`/admin/applications/${id}`, { params: { type } });
    return normalizeApplication(res.data as unknown as Record<string, unknown>) as unknown as Application;
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

  async changeUserRole(id: string, role: 'customer' | 'driver' | 'restaurant' | 'admin'): Promise<void> {
    await api.put(`/admin/users/${id}/role`, { role });
  },

  async getWithdrawals(params?: { status?: string; entityType?: string }): Promise<WithdrawalRequest[]> {
    const res = await api.get<never, ApiResponse<WithdrawalRequest[]>>('/admin/withdrawals', { params });
    return res.data ?? [];
  },

  async approveWithdrawal(id: string, notes?: string): Promise<void> {
    await api.put(`/admin/withdrawals/${id}/approve`, { notes });
  },

  async rejectWithdrawal(id: string, reason?: string): Promise<void> {
    await api.put(`/admin/withdrawals/${id}/reject`, { reason });
  },

  async getDriversOverview(): Promise<AdminDriverOverview[]> {
    const res = await api.get<never, ApiResponse<AdminDriverOverview[]>>('/admin/drivers');
    return res.data ?? [];
  },

  async getRestaurantsOverview(): Promise<AdminRestaurantOverview[]> {
    const res = await api.get<never, ApiResponse<AdminRestaurantOverview[]>>('/admin/restaurants');
    return res.data ?? [];
  },

  async getCustomersOverview(search?: string): Promise<AdminCustomerOverview[]> {
    const res = await api.get<never, ApiResponse<AdminCustomerOverview[]>>('/admin/customers', { params: { search } });
    return res.data ?? [];
  },
};

export interface MyApplicationStatus {
  role: string;
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  driverApplication: {
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    rejectionReason?: string;
    vehicleType?: string;
  } | null;
  restaurantApplication: {
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    rejectionReason?: string;
    tradingName?: string;
  } | null;
}

export const applicationsService = {
  async getMyApplication(): Promise<MyApplicationStatus> {
    const res = await api.get<never, ApiResponse<MyApplicationStatus>>('/applications/me');
    return res.data;
  },

  async submitDriverApplication(data: {
    idNumber?: string;
    dateOfBirth?: string;
    yearsExperience?: string;
    prdpNumber?: string;
    prdpExpiry?: string;
    vehicleType?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleReg?: string;
    vehicleColour?: string;
    bankName?: string;
    bankAccountNo?: string;
    bankHolder?: string;
    bankBranch?: string;
    bankAccountType?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    criminalRecordConsent?: boolean;
    idDocumentUrl?: string;
    driversLicenseUrl?: string;
    vehicleRegistrationUrl?: string;
    vehiclePhotoUrl?: string;
    licensePlatePhotoUrl?: string;
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
