import React, { useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, CheckCircle, ChefHat, Bike, Car, PartyPopper, XCircle, Tag, Award, Megaphone } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { useNotificationStore } from '@/stores/notificationStore';
import { notificationService } from '@/services/notification.service';
import { queryKeys } from '@/constants/queryKeys';
import { Notification } from '@/types/notification.types';
import { T } from '@/constants/colors';
import { formatDate } from '@/utils/formatters';

type IconComponent = React.ComponentType<{ size: number; color: string }>;

const TYPE_ICON: Record<string, { Icon: IconComponent; bg: string; color: string }> = {
  order_placed:    { Icon: Package,      bg: T.surface,    color: T.textSec },
  order_confirmed: { Icon: CheckCircle,  bg: T.successBg,  color: T.success },
  order_preparing: { Icon: ChefHat,      bg: T.surface,    color: T.textSec },
  order_picked_up: { Icon: Bike,         bg: T.surface,    color: T.textSec },
  order_on_way:    { Icon: Car,          bg: T.surface,    color: T.textSec },
  order_delivered: { Icon: PartyPopper,  bg: T.successBg,  color: T.success },
  order_cancelled: { Icon: XCircle,      bg: T.dangerBg,   color: T.danger },
  promo:           { Icon: Tag,          bg: T.goldBg,     color: T.gold },
  loyalty:         { Icon: Award,        bg: T.goldBg,     color: T.gold },
  general:         { Icon: Megaphone,    bg: T.surface,    color: T.textSec },
};

function NotificationItem({ item }: { item: Notification }) {
  const config = TYPE_ICON[item.type] ?? TYPE_ICON.general;
  const IconComp = config.Icon;

  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: item.isRead ? T.bg : T.surface }}>
      {!item.isRead && <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: T.action }} />}
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: config.bg, alignItems: 'center', justifyContent: 'center' }}>
        <IconComp size={18} color={config.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: item.isRead ? '600' : '800', fontSize: 15, color: T.text, marginBottom: 3 }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: T.textSec, lineHeight: 20 }}>{item.body}</Text>
        <Text style={{ fontSize: 12, color: T.textTer, marginTop: 4 }}>{formatDate(item.createdAt)}</Text>
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
  const hasUnread = notifications.some((n: Notification) => !n.isRead);

  return (
    <ScreenWrapper bg="white">
      <View style={{ backgroundColor: T.bg, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: T.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: T.text, fontSize: 22, fontWeight: '900' }}>Notifications</Text>
        {hasUnread && (
          <Pressable onPress={() => markAllRead.mutate()}>
            <Text style={{ color: T.action, fontWeight: '600', fontSize: 14 }}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.action} />
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
