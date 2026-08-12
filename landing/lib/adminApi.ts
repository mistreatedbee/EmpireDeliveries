import { clearAdminSession, getStoredToken } from "@/lib/adminAuth"
import { normalizeApplication, normalizeApplications } from "@/lib/normalizeApplication"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export class AdminApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    clearAdminSession()
    if (typeof window !== "undefined") window.location.href = "/admin-access"
    throw new AdminApiError("Session expired.", 401)
  }

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new AdminApiError(body?.message ?? body?.code ?? "Request failed.", res.status)
  }
  return body?.data ?? body
}

function withQuery(path: string, params?: Record<string, string | number | undefined>) {
  if (!params) return path
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  if (entries.length === 0) return path
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))
  return `${path}?${search.toString()}`
}

export interface AdminStats {
  users: { total: number; customers: number; drivers: number; restaurants: number; pendingApproval: number }
  orders: { today: number; revenueToday: number }
  pendingDriverApplications: number
  pendingRestaurantApplications: number
}

export interface Application {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  rejectionReason?: string
  applicationType: "driver" | "restaurant"
  incompleteSignup?: boolean
  idDocumentUrl?: string
  driversLicenseUrl?: string
  vehicleRegistrationUrl?: string
  businessDocUrl?: string
  vehicleType?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: number
  vehicleReg?: string
  idNumber?: string
  dateOfBirth?: string
  bankName?: string
  bankAccountNo?: string
  bankHolder?: string
  tradingName?: string
  businessRegNo?: string
  cuisineType?: string
  address?: string
  city?: string
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  approvalStatus: string
  isVerified: boolean
  createdAt: string
  subscriptionExpiresAt?: string | null
}

export const adminApi = {
  getStats: () => request<AdminStats>("/admin/stats"),

  getApplications: async (params?: { type?: string; status?: string }) => {
    const data = await request<Application[]>(withQuery("/admin/applications", params))
    return normalizeApplications(data as unknown as Record<string, unknown>[]) as unknown as Application[]
  },

  getApplication: async (id: string, type?: string) => {
    const data = await request<Application>(withQuery(`/admin/applications/${id}`, { type }))
    return normalizeApplication(data as unknown as Record<string, unknown>) as unknown as Application
  },

  approveApplication: (id: string, type: "driver" | "restaurant") =>
    request(`/admin/applications/${id}/approve`, { method: "PUT", body: JSON.stringify({ type }) }),

  rejectApplication: (id: string, type: "driver" | "restaurant", reason?: string) =>
    request(`/admin/applications/${id}/reject`, { method: "PUT", body: JSON.stringify({ type, reason }) }),

  getUsers: (params?: { search?: string; role?: string; status?: string; page?: number }) =>
    request<{ data: AdminUser[]; total: number }>(withQuery("/admin/users", params)),

  suspendUser: (id: string, reason?: string) =>
    request(`/admin/users/${id}/suspend`, { method: "PUT", body: JSON.stringify({ reason }) }),

  reactivateUser: (id: string) => request(`/admin/users/${id}/reactivate`, { method: "PUT" }),

  updateSubscription: (id: string, expiresAt: string) =>
    request(`/admin/users/${id}/subscription`, { method: "PUT", body: JSON.stringify({ expiresAt }) }),
}
