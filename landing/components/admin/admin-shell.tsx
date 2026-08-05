"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { adminLogout, getStoredToken, getStoredUser, restoreInsforgeSession, type AdminUser } from "@/lib/adminAuth"

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/support", label: "Support Inbox" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = getStoredToken()
    const adminSession = window.localStorage.getItem("empire_admin_session")
    const storedUser = getStoredUser()
    if (!token && !adminSession) {
      router.replace("/admin-access")
      return
    }
    if (token) restoreInsforgeSession()
    setUser(storedUser ?? { id: "", firstName: "Admin", lastName: "", email: "empiredelivery013@gmail.com", role: "admin" })
    setReady(true)
  }, [router])

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-background">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" || pathname === "/admin/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-3 text-xs text-muted-foreground">{user.email}</p>
          <Button
            variant="ghost"
            className="mt-1 w-full justify-start"
            onClick={() => {
              adminLogout()
              window.localStorage.removeItem("empire_admin_session")
              router.replace("/admin-access")
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
