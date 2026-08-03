import React, { useRef, useState } from 'react';
import { View, Text, Pressable, TextInput, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { useMessages, useSendMessage } from '@/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';
import { T } from '@/constants/colors';
import { Message } from '@/types/chat.types';

export default function ChatScreen() {
  const { conversationId, title } = useLocalSearchParams<{ conversationId: string; title?: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const handleSend = () => {
    const body = text.trim();
    if (!body) return;
    setText('');
    sendMessage.mutate(body, {
      onSuccess: () => setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50),
    });
  };

  return (
    <ScreenWrapper bg="white" edges={['top', 'bottom', 'left', 'right']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}
        >
          <Text style={{ fontSize: 20, color: T.text }}>←</Text>
        </Pressable>
        <Text style={{ fontWeight: '800', fontSize: 16, color: T.text }}>{title ?? 'Chat'}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {isLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={T.action} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages ?? []}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Text style={{ color: T.textTer, fontSize: 14 }}>No messages yet — say hello!</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isMine = item.sender_id === currentUserId;
              return (
                <View style={{ alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  <View
                    style={{
                      maxWidth: '78%',
                      backgroundColor: isMine ? T.action : T.surface2,
                      borderRadius: 16,
                      borderBottomRightRadius: isMine ? 4 : 16,
                      borderBottomLeftRadius: isMine ? 16 : 4,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: isMine ? '#FFF' : T.text, fontSize: 15, lineHeight: 20 }}>{item.body}</Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: T.border }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={T.textTer}
            multiline
            style={{
              flex: 1,
              backgroundColor: T.surface2,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              maxHeight: 100,
              color: T.text,
              fontSize: 15,
            }}
          />
          <Pressable
            onPress={handleSend}
            disabled={!text.trim() || sendMessage.isPending}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: T.action,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !text.trim() || sendMessage.isPending ? 0.5 : 1,
            }}
          >
            <Send size={18} color="#FFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
