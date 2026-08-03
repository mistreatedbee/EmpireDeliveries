import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { insforge } from '@/lib/insforgeClient';
import { chatService } from '@/services/chat.service';
import { queryKeys } from '@/constants/queryKeys';
import { ConversationContextType, Message, NewMessageEvent } from '@/types/chat.types';
import { useAuthStore } from '@/stores/authStore';

export function useOrderConversation(orderId: string | undefined, contextType: ConversationContextType) {
  return useQuery({
    queryKey: queryKeys.messages.orderConversation(orderId ?? '', contextType),
    queryFn: () => chatService.getOrderConversation(orderId!, contextType),
    enabled: !!orderId,
  });
}

export function useSupportConversation() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: queryKeys.messages.supportConversation,
    queryFn: () => chatService.getOrCreateSupportConversation(userId!),
    enabled: !!userId,
  });
}

export function useSupportInbox() {
  return useQuery({
    queryKey: queryKeys.messages.supportInbox,
    queryFn: () => chatService.listSupportConversations(),
  });
}

// Fetches message history for a conversation and keeps it live via InsForge
// realtime (foreground only — no push notification when the app is backgrounded,
// see plan notes).
export function useMessages(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.messages.thread(conversationId ?? '');

  const query = useQuery({
    queryKey,
    queryFn: () => chatService.listMessages(conversationId!),
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    const channel = `conversation:${conversationId}`;

    const onNewMessage = (payload: NewMessageEvent) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev) => {
        if (!prev) return prev;
        if (prev.some((m) => m.id === payload.id)) return prev;
        return [...prev, payload as Message];
      });
    };

    insforge.realtime
      .connect()
      .then(() => insforge.realtime.subscribe(channel))
      .then(() => {
        if (!active) return;
        insforge.realtime.on<NewMessageEvent>('new_message', onNewMessage);
      })
      .catch(() => null);

    return () => {
      active = false;
      insforge.realtime.off<NewMessageEvent>('new_message', onNewMessage);
      insforge.realtime.unsubscribe(channel);
    };
  }, [conversationId, queryClient, queryKey]);

  return query;
}

export function useSendMessage(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const queryKey = queryKeys.messages.thread(conversationId ?? '');

  return useMutation({
    mutationFn: (body: string) => {
      if (!conversationId || !user) throw new Error('Missing conversation or user');
      return chatService.sendMessage({
        conversationId,
        senderId: user.id,
        senderRole: user.role,
        body,
      });
    },
    onSuccess: (message) => {
      queryClient.setQueryData<Message[]>(queryKey, (prev) => {
        if (!prev) return [message];
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    },
  });
}
