"use client"

import { useState } from "react"
import { Crown, Eye, EyeOff, Shield, AlertCircle } from "lucide-react"

export default function AdminAccessPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 1000))

    if (email === "admin@empiredeliveries.co.za" && password === "empire@admin") {
      window.location.href = "/admin-panel"
    } else {
      setError("Invalid credentials. Access denied.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-2xl blur-md" />
            <div className="relative w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-[#0A0A0A]" strokeWidth={1.5} />
            </div>
          </div>
          <p className="font-black text-white text-xl tracking-tight leading-none">EMPIRE</p>
          <p className="text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mt-0.5">Admin Console</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-white/60 text-sm font-medium">Secure Admin Access</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empiredeliveries.co.za"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-[#0A0A0A] font-bold text-sm py-3.5 rounded-2xl hover:bg-[#F5D876] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Verifying..." : "Sign In to Admin Console"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Unauthorised access is strictly prohibited and monitored.
        </p>
      </div>
    </div>
  )
}
