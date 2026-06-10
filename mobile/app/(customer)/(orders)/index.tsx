import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/order.types';
import { orderService } from '@/services/order.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { T } from '@/constants/colors';
import { formatPrice, formatDate, formatOrderStatus } from '@/utils/formatters';

type Tab = 'active' | 'completed' | 'cancelled';

const STATUS_MAP: Record<Tab, string[]> = {
  active: ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way'],
  completed: ['delivered'],
  cancelled: ['cancelled'],
};

function OrderCard({ order, onCancel }: { order: Order; onCancel: () => void }) {
  const isActive = STATUS_MAP.active.includes(order.status);
  const canCancel = order.status === 'placed';

  return (
    <Pressable
      onPress={() => isActive ? router.push(`/(customer)/(orders)/tracking/${order.id}`) : undefined}
      style={{ backgroundColor: T.bg, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: T.border }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Image source={{ uri: order.restaurantLogo }} style={{ width: 48, height: 48, borderRadius: 10, backgroundColor: T.surface }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }} numberOfLines={1}>{order.restaurantName}</Text>
          <Text style={{ fontSize: 13, color: T.textSec, marginTop: 2 }}>{formatDate(order.placedAt)} · {order.items.length} items</Text>
        </View>
        <Badge
          label={formatOrderStatus(order.status)}
          variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'default'}
          size="sm"
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: T.textSec, fontSize: 13, flex: 1, marginRight: 8 }} numberOfLines={1}>
          {order.items.map((i) => i.menuItemName).join(', ')}
        </Text>
        <Text style={{ fontWeight: '800', fontSize: 15, color: T.text }}>{formatPrice(order.total)}</Text>
      </View>
      {isActive && (
        <View style={{ marginTop: 10, backgroundColor: T.surface, borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: T.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={14} color={T.textSec} />
            <Text style={{ color: T.textSec, fontWeight: '600', fontSize: 13 }}>Tap to track your order</Text>
          </View>
          {canCancel && (
            <Pressable
              onPress={(e) => { e.stopPropagation(); onCancel(); }}
              style={{ backgroundColor: T.danger, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}
            >
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12 }}>Cancel</Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const activeStatus = STATUS_MAP[activeTab].join(',');
  const { data, isLoading } = useOrders(activeStatus);

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast('Order cancelled', 'success');
    },
    onError: () => showToast('Cannot cancel this order', 'error'),
  });

  const handleCancel = (order: Order) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'Keep Order', style: 'cancel' },
      { text: 'Cancel Order', style: 'destructive', onPress: () => cancelMutation.mutate(order.id) },
    ]);
  };

  const orders = data?.data ?? [];

  return (
    <ScreenWrapper bg="white">
      {/* Header + tabs */}
      <View style={{ backgroundColor: T.bg, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Text style={{ color: T.text, fontSize: 22, fontWeight: '900', marginBottom: 14 }}>My Orders</Text>
        <View style={{ flexDirection: 'row' }}>
          {(['active', 'completed', 'cancelled'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? T.action : 'transparent', alignItems: 'center' }}
            >
              <Text style={{ color: activeTab === tab ? T.text : T.textTer, fontWeight: '700', textTransform: 'capitalize', fontSize: 14 }}>{tab}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.action} />
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          title={activeTab === 'active' ? 'No active orders' : activeTab === 'completed' ? 'No completed orders' : 'No cancelled orders'}
          subtitle="Your orders will appear here"
          actionLabel={activeTab === 'active' ? 'Order Now' : undefined}
          onAction={activeTab === 'active' ? () => router.replace('/(customer)') : undefined}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => <OrderCard order={item} onCancel={() => handleCancel(item)} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
