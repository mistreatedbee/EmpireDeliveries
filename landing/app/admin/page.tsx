"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { AdminShell } from "@/components/admin/admin-shell"
import { adminApi } from "@/lib/adminApi"

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
  })

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p>}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total users" value={data.users.total} />
            <StatCard label="Customers" value={data.users.customers} />
            <StatCard label="Drivers" value={data.users.drivers} />
            <StatCard label="Restaurants" value={data.users.restaurants} />
            <StatCard label="Pending approval" value={data.users.pendingApproval} />
            <StatCard label="Orders today" value={data.orders.today} />
            <StatCard label="Revenue today" value={`R${data.orders.revenueToday.toFixed(2)}`} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin/applications"
              className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary"
            >
              <p className="text-sm text-muted-foreground">Pending driver applications</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{data.pendingDriverApplications}</p>
            </Link>
            <Link
              href="/admin/applications"
              className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary"
            >
              <p className="text-sm text-muted-foreground">Pending restaurant applications</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{data.pendingRestaurantApplications}</p>
            </Link>
          </div>
        </>
      )}
    </AdminShell>
  )
}
