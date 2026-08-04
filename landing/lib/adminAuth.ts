const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL!
const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

import { setInsforgeSessionToken } from "@/lib/insforgeClient"

const TOKEN_KEY = "admin_access_token"
const USER_KEY = "admin_user"

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

function persist(token: string, user: AdminUser) {
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  setInsforgeSessionToken(token)
}

export function clearAdminSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(USER_KEY)
  setInsforgeSessionToken(null)
}

// Re-applies the stored Bearer token to the InsForge client singleton — needed
// on every page load since the client is recreated in memory but the session
// itself lives in localStorage.
export function restoreInsforgeSession() {
  const token = getStoredToken()
  if (token) setInsforgeSessionToken(token)
}

export class AdminAuthError extends Error {}

// Mirrors mobile/src/services/auth.service.ts: login goes directly to InsForge
// for a session token, then Express /auth/me confirms the role — admin status
// is always re-checked server-side on every /admin/* call regardless.
export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const sessionRes = await fetch(`${INSFORGE_URL}/api/auth/sessions?client_type=mobile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${INSFORGE_ANON_KEY}`,
    },
    body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
  })

  if (!sessionRes.ok) {
    throw new AdminAuthError("Invalid email or password.")
  }
  const { accessToken } = await sessionRes.json()

  const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!meRes.ok) {
    throw new AdminAuthError("Could not verify account.")
  }
  const body = await meRes.json()
  const user: AdminUser = body.data ?? body

  if (user.role !== "admin") {
    throw new AdminAuthError("This account does not have admin access.")
  }

  persist(accessToken, user)
  return user
}

export function adminLogout() {
  clearAdminSession()
}
