import React, { useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotificationStore } from '@/stores/notificationStore';
import { notificationService } from '@/services/notification.service';
import { queryKeys } from '@/constants/queryKeys';
import { Notification } from '@/types/notification.types';
import { Colors } from '@/constants/colors';
import { formatDate } from '@/utils/formatters';

const TYPE_EMOJI: Record<string, string> = {
  order_placed: '📦', order_confirmed: '✅', order_preparing: '👨‍🍳',
  order_picked_up: '🛵', order_on_way: '🚗', order_delivered: '🎉',
  order_cancelled: '❌', promo: '🎁', loyalty: '🏆', general: '📢',
};

function NotificationItem({ item }: { item: Notification }) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: item.isRead ? '#FFF' : '#FEFBF0' }}>
      {!item.isRead && <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: Colors.gold[500] }} />}
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: item.isRead ? '#F0F0F0' : Colors.gold[50], alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22 }}>{TYPE_EMOJI[item.type] ?? '📢'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: item.isRead ? '600' : '800', fontSize: 15, color: Colors.empire.black, marginBottom: 3 }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{item.body}</Text>
        <Text style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>{formatDate(item.createdAt)}</Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const { clearUnread } = useNotificationStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.user.notifications(),
    queryFn: () => notificationService.getList(),
  });

  const markAllRead = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.notifications() }),
  });

  useEffect(() => {
    clearUnread();
  }, [clearUnread]);

  const notifications = data?.data ?? [];

  return (
    <ScreenWrapper bg="surface">
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900' }}>Notifications</Text>
        {notifications.some((n: import('@/types/notification.types').Notification) => !n.isRead) && (
          <Pressable onPress={() => markAllRead.mutate()}>
            <Text style={{ color: Colors.gold[500], fontWeight: '600', fontSize: 14 }}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[500]} />
        </View>
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications" subtitle="You're all caught up!" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
