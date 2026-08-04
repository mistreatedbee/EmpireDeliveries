"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AdminShell } from "@/components/admin/admin-shell"
import { Button } from "@/components/ui/button"
import { adminChat, type Message } from "@/lib/adminChat"
import { insforge } from "@/lib/insforgeClient"
import { getStoredUser } from "@/lib/adminAuth"

function ChatThread({ conversationId }: { conversationId: string }) {
  const queryClient = useQueryClient()
  const queryKey = ["admin-support-thread", conversationId]
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => adminChat.listMessages(conversationId),
  })

  useEffect(() => {
    let active = true
    const channel = `conversation:${conversationId}`
    const onNewMessage = (payload: Message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev) => {
        if (!prev) return prev
        if (prev.some((m) => m.id === payload.id)) return prev
        return [...prev, payload]
      })
    }

    insforge.realtime
      .connect()
      .then(() => insforge.realtime.subscribe(channel))
      .then(() => {
        if (!active) return
        insforge.realtime.on<Message>("new_message", onNewMessage)
      })
      .catch(() => null)

    return () => {
      active = false
      insforge.realtime.off<Message>("new_message", onNewMessage)
      insforge.realtime.unsubscribe(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data])

  const send = useMutation({
    mutationFn: (body: string) => {
      const user = getStoredUser()
      if (!user) throw new Error("Not signed in")
      return adminChat.sendMessage({ conversationId, senderId: user.id, body })
    },
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev) => {
        if (!prev) return [message]
        if (prev.some((m) => m.id === message.id)) return prev
        return [...prev, message]
      })
      setDraft("")
    },
  })

  return (
    <AdminShell>
      <h1 className="text-xl font-semibold text-foreground">Conversation #{conversationId.slice(-6).toUpperCase()}</h1>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="mt-6 text-sm text-destructive">{(error as Error).message}</p>}

      <div className="mt-4 flex h-[60vh] flex-col rounded-xl border border-border bg-background">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {data?.map((m) => (
            <div key={m.id} className={`flex ${m.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                  m.sender_role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p>{m.body}</p>
                <p className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (draft.trim()) send.mutate(draft.trim())
          }}
          className="flex gap-2 border-t border-border p-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a reply…"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
          />
          <Button type="submit" disabled={!draft.trim() || send.isPending}>
            Send
          </Button>
        </form>
      </div>
    </AdminShell>
  )
}

export default function SupportThreadPage() {
  return (
    <Suspense>
      <SupportThreadInner />
    </Suspense>
  )
}

function SupportThreadInner() {
  const params = useSearchParams()
  const id = params.get("id")

  if (!id) {
    return (
      <AdminShell>
        <p className="text-sm text-muted-foreground">No conversation selected.</p>
      </AdminShell>
    )
  }

  return <ChatThread conversationId={id} />
}
