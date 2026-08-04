import { insforge } from "@/lib/insforgeClient"

export interface Conversation {
  id: string
  context_type: "customer_driver" | "customer_restaurant" | "driver_restaurant" | "support"
  order_id: string | null
  customer_id: string
  driver_id: string | null
  restaurant_id: string | null
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_role: string
  body: string
  created_at: string
}

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message)
  if (result.data == null) throw new Error("Not found")
  return result.data
}

export const adminChat = {
  async listSupportConversations(): Promise<Conversation[]> {
    const res = await insforge.database
      .from("conversations")
      .select("*")
      .eq("context_type", "support")
      .order("last_message_at", { ascending: false })
    if (res.error) throw new Error(res.error.message)
    return (res.data as Conversation[]) ?? []
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    const res = await insforge.database
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
    if (res.error) throw new Error(res.error.message)
    return (res.data as Message[]) ?? []
  },

  async sendMessage({
    conversationId,
    senderId,
    body,
  }: {
    conversationId: string
    senderId: string
    body: string
  }): Promise<Message> {
    const res = await insforge.database
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: senderId, sender_role: "admin", body })
      .select()
      .single()
    return unwrap(res as { data: Message | null; error: { message: string } | null })
  },
}
