import { insforge } from '@/lib/insforgeClient';
import { Conversation, ConversationContextType, Message } from '@/types/chat.types';
import { getUserErrorMessage } from '@/utils/errorHandler';

function unwrap<T>(result: { data: T | null; error: { message: string; code?: string } | null }): T {
  if (result.error) throw new Error(getUserErrorMessage(result.error));
  if (result.data == null) throw new Error('We could not find what you were looking for.');
  return result.data;
}

export const chatService = {
  // Customer-only: proactively create/find the order-scoped conversations once
  // the customer knows the driver/restaurant involved (driver id isn't exposed
  // to the driver/restaurant apps by the Express API, so the customer side is
  // the only place that can seed all three with the right participant ids).
  async ensureOrderConversations({
    orderId,
    customerId,
    restaurantId,
    driverId,
  }: {
    orderId: string;
    customerId?: string;
    restaurantId?: string;
    driverId?: string;
  }): Promise<void> {
    if (!customerId) return;

    const contexts: Array<{ context_type: ConversationContextType; restaurant_id?: string; driver_id?: string }> = [
      ...(restaurantId ? [{ context_type: 'customer_restaurant' as const, restaurant_id: restaurantId }] : []),
      ...(driverId ? [{ context_type: 'customer_driver' as const, driver_id: driverId }] : []),
      ...(driverId && restaurantId ? [{ context_type: 'driver_restaurant' as const, driver_id: driverId, restaurant_id: restaurantId }] : []),
    ];

    for (const ctx of contexts) {
      const existing = await insforge.database
        .from('conversations')
        .select('id')
        .eq('order_id', orderId)
        .eq('context_type', ctx.context_type)
        .maybeSingle();
      if (existing.data) continue;

      await insforge.database.from('conversations').insert({
        context_type: ctx.context_type,
        order_id: orderId,
        customer_id: customerId,
        restaurant_id: ctx.restaurant_id ?? restaurantId ?? null,
        driver_id: ctx.driver_id ?? null,
      });
    }
  },

  async getOrderConversation(orderId: string, contextType: ConversationContextType): Promise<Conversation | null> {
    const res = await insforge.database
      .from('conversations')
      .select('*')
      .eq('order_id', orderId)
      .eq('context_type', contextType)
      .maybeSingle();
    if (res.error) throw new Error(getUserErrorMessage(res.error));
    return (res.data as Conversation | null) ?? null;
  },

  async getOrCreateSupportConversation(customerId: string): Promise<Conversation> {
    const existing = await insforge.database
      .from('conversations')
      .select('*')
      .eq('context_type', 'support')
      .eq('customer_id', customerId)
      .maybeSingle();
    if (existing.data) return existing.data as Conversation;

    const created = await insforge.database
      .from('conversations')
      .insert({ context_type: 'support', customer_id: customerId })
      .select()
      .single();
    return unwrap(created as { data: Conversation | null; error: { message: string } | null });
  },

  async listSupportConversations(): Promise<Conversation[]> {
    const res = await insforge.database
      .from('conversations')
      .select('*')
      .eq('context_type', 'support')
      .order('last_message_at', { ascending: false });
    if (res.error) throw new Error(getUserErrorMessage(res.error));
    return (res.data as Conversation[]) ?? [];
  },

  async listMessages(conversationId: string): Promise<Message[]> {
    const res = await insforge.database
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (res.error) throw new Error(getUserErrorMessage(res.error));
    return (res.data as Message[]) ?? [];
  },

  async sendMessage({
    conversationId,
    senderId,
    senderRole,
    body,
  }: {
    conversationId: string;
    senderId: string;
    senderRole: string;
    body: string;
  }): Promise<Message> {
    const res = await insforge.database
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: senderId, sender_role: senderRole, body })
      .select()
      .single();
    return unwrap(res as { data: Message | null; error: { message: string } | null });
  },
};
