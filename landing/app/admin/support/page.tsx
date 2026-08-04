"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { AdminShell } from "@/components/admin/admin-shell"
import { adminChat } from "@/lib/adminChat"

export default function SupportInboxPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-support-inbox"],
    queryFn: adminChat.listSupportConversations,
  })

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-foreground">Support Inbox</h1>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p>}
      {data && data.length === 0 && <p className="mt-6 text-sm text-muted-foreground">No support conversations yet.</p>}

      <div className="mt-4 space-y-2">
        {data?.map((c) => (
          <Link
            key={c.id}
            href={`/admin/support/thread?id=${c.id}`}
            className="block rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary"
          >
            <p className="font-medium text-foreground">Conversation #{c.id.slice(-6).toUpperCase()}</p>
            <p className="mt-1 text-xs text-muted-foreground">Last activity {new Date(c.last_message_at).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  )
}
