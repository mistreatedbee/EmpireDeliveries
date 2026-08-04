"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { adminLogin, getStoredToken, AdminAuthError } from "@/lib/adminAuth"
import { useEffect } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getStoredToken()) router.replace("/admin")
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await adminLogin(email, password)
      router.replace("/admin")
    } catch (err) {
      setError(err instanceof AdminAuthError ? err.message : "Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-background p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-lg font-semibold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Empire Deliveries admin panel
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
