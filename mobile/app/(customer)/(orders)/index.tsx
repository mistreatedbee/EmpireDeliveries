import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types/order.types';
import { Colors } from '@/constants/colors';
import { formatPrice, formatDate, formatOrderStatus } from '@/utils/formatters';

type Tab = 'active' | 'completed' | 'cancelled';

const STATUS_MAP: Record<Tab, string[]> = {
  active: ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way'],
  completed: ['delivered'],
  cancelled: ['cancelled'],
};

function OrderCard({ order }: { order: Order }) {
  const isActive = STATUS_MAP.active.includes(order.status);
  return (
    <Pressable
      onPress={() => isActive ? router.push(`/(customer)/(orders)/tracking/${order.id}`) : undefined}
      style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Image source={{ uri: order.restaurantLogo }} style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F0F0F0' }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: Colors.empire.black }} numberOfLines={1}>{order.restaurantName}</Text>
          <Text style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{formatDate(order.placedAt)} • {order.items.length} items</Text>
        </View>
        <Badge
          label={formatOrderStatus(order.status)}
          variant={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'gold'}
          size="sm"
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#666', fontSize: 14 }}>{order.items.map((i) => i.menuItemName).join(', ').slice(0, 40)}...</Text>
        <Text style={{ fontWeight: '800', fontSize: 16, color: Colors.empire.black }}>{formatPrice(order.total)}</Text>
      </View>
      {isActive && (
        <View style={{ marginTop: 10, backgroundColor: Colors.gold[50], borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🔄</Text>
          <Text style={{ color: Colors.gold[700], fontWeight: '700', fontSize: 13 }}>Tap to track your order</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('active');

  const activeStatus = STATUS_MAP[activeTab].join(',');
  const { data, isLoading } = useOrders(activeStatus);

  const orders = data?.data ?? [];

  return (
    <ScreenWrapper bg="surface">
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 16 }}>My Orders</Text>
        <View style={{ flexDirection: 'row' }}>
          {(['active', 'completed', 'cancelled'] as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: activeTab === tab ? Colors.gold[500] : 'transparent', alignItems: 'center' }}
            >
              <Text style={{ color: activeTab === tab ? Colors.gold[500] : '#888', fontWeight: '700', textTransform: 'capitalize', fontSize: 14 }}>{tab}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[500]} />
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
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}
