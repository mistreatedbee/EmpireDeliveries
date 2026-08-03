import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import { useSupportInbox } from '@/hooks/useChat';
import { EmptyState, SkeletonList } from '@/components/empire';

export default function SupportInboxScreen() {
  const { data: conversations, isLoading } = useSupportInbox();

  return (
    <View className="flex-1 bg-t-dark">
      <View className="px-6 pb-4 border-b border-t-border" style={{ paddingTop: 56 }}>
        <Text className="text-t-textSec text-xs" style={{ fontFamily: 'Inter_700Bold', letterSpacing: 2 }}>
          ADMIN PORTAL
        </Text>
        <Text className="text-white text-2xl mt-0.5" style={{ fontFamily: 'Inter_900Black' }}>
          Support Inbox
        </Text>
      </View>

      {isLoading ? (
        <View className="px-4 mt-4">
          <SkeletonList rows={6} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {(conversations ?? []).length === 0 ? (
            <EmptyState
              icon={<MessageCircle size={28} color="#A3A3A3" />}
              title="No support conversations"
              description="Customer and driver support chats will show up here."
              className="py-16"
            />
          ) : (
            (conversations ?? []).map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push({ pathname: '/(modals)/chat/[conversationId]', params: { conversationId: c.id, title: 'Support' } })}
                className="bg-t-surface rounded-2xl p-4 mb-3 border border-t-border"
              >
                <Text className="text-t-text text-sm" style={{ fontFamily: 'Inter_700Bold' }}>
                  Conversation #{c.id.slice(-6).toUpperCase()}
                </Text>
                <Text className="text-t-textTer text-xs mt-1" style={{ fontFamily: 'Inter_400Regular' }}>
                  Last activity {new Date(c.last_message_at).toLocaleString()}
                </Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
