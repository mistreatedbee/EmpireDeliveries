"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/adminApi"

const roles = ["", "customer", "driver", "restaurant", "admin"]
const statuses = ["", "approved", "pending", "suspended", "rejected"]
const PAGE_SIZE = 20

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [subDraft, setSubDraft] = useState<{ id: string; date: string } | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users", search, role, status, page],
    queryFn: () => adminApi.getUsers({ search: search || undefined, role: role || undefined, status: status || undefined, page }),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] })

  const suspend = useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id),
    onSuccess: invalidate,
  })
  const reactivate = useMutation({
    mutationFn: (id: string) => adminApi.reactivateUser(id),
    onSuccess: invalidate,
  })
  const updateSub = useMutation({
    mutationFn: ({ id, expiresAt }: { id: string; expiresAt: string }) => adminApi.updateSubscription(id, expiresAt),
    onSuccess: () => {
      invalidate()
      setSubDraft(null)
    },
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-foreground">Users</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search name, email, phone…"
          className="w-64 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r ? r[0].toUpperCase() + r.slice(1) : "All roles"}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s ? s[0].toUpperCase() + s.slice(1) : "All statuses"}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p>}

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">
                  {u.firstName} {u.lastName}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 capitalize text-foreground">{u.role}</td>
                <td className="px-4 py-3 capitalize text-foreground">{u.approvalStatus}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {u.role !== "admin" && u.approvalStatus !== "suspended" && (
                      <Button size="xs" variant="destructive" onClick={() => suspend.mutate(u.id)} disabled={suspend.isPending}>
                        Suspend
                      </Button>
                    )}
                    {u.approvalStatus === "suspended" && (
                      <Button size="xs" onClick={() => reactivate.mutate(u.id)} disabled={reactivate.isPending}>
                        Reactivate
                      </Button>
                    )}
                    <Button size="xs" variant="outline" onClick={() => setSubDraft({ id: u.id, date: "" })}>
                      Subscription
                    </Button>
                  </div>
                  {subDraft?.id === u.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="date"
                        value={subDraft.date}
                        onChange={(e) => setSubDraft({ id: u.id, date: e.target.value })}
                        className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-ring"
                      />
                      <Button
                        size="xs"
                        onClick={() => subDraft.date && updateSub.mutate({ id: u.id, expiresAt: new Date(subDraft.date).toISOString() })}
                        disabled={!subDraft.date || updateSub.isPending}
                      >
                        Set
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && data.total > PAGE_SIZE && (
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </AdminShell>
  )
}
