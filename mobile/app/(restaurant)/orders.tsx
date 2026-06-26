import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantManagementService, RestaurantOrder } from '@/services/restaurant-management.service';
import { Colors } from '@/constants/colors';

type Filter = 'all' | 'placed' | 'preparing' | 'ready';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'placed', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
];

export default function RestaurantOrders() {
  const [filter, setFilter] = useState<Filter>('all');
  const queryClient = useQueryClient();

  const statusParam = filter === 'all' ? 'placed,confirmed,preparing,ready' : filter;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['restaurant', 'orders', filter],
    queryFn: () => restaurantManagementService.getOrders(statusParam),
    refetchInterval: 15000,
  });

  const confirmMutation = useMutation({
    mutationFn: restaurantManagementService.confirmOrder,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] }),
  });
  const preparingMutation = useMutation({
    mutationFn: restaurantManagementService.markPreparing,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] }),
  });
  const readyMutation = useMutation({
    mutationFn: restaurantManagementService.markReady,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] }),
  });

  function getAction(order: RestaurantOrder) {
    if (order.status === 'placed') return { label: 'Confirm', onPress: () => confirmMutation.mutate(order.id), loading: confirmMutation.isPending };
    if (order.status === 'confirmed') return { label: 'Mark Preparing', onPress: () => preparingMutation.mutate(order.id), loading: preparingMutation.isPending };
    if (order.status === 'preparing') return { label: 'Mark Ready', onPress: () => readyMutation.mutate(order.id), loading: readyMutation.isPending };
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Orders</Text>
      </View>

      {/* Filter pills */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8, backgroundColor: Colors.empire.black, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={{ paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: filter === f.id ? Colors.gold[500] : Colors.empire.charcoal }}
          >
            <Text style={{ color: filter === f.id ? Colors.empire.black : '#aaa', fontWeight: '700', fontSize: 13 }}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {isLoading && <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 20 }} />}
        {!isLoading && (orders ?? []).map((order) => {
          const action = getAction(order);
          return (
            <View key={order.id} style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.surface[200] }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <View>
                  <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15 }}>{order.customerName}</Text>
                  <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{order.customerPhone}</Text>
                </View>
                <View style={{ backgroundColor: statusBg(order.status), paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ color: statusFg(order.status), fontWeight: '700', fontSize: 12 }}>{statusLabel(order.status)}</Text>
                </View>
              </View>

              {/* Items */}
              <View style={{ backgroundColor: Colors.surface[100], borderRadius: 12, padding: 12, marginBottom: 10 }}>
                {order.items.map((item, i) => (
                  <Text key={i} style={{ color: '#555', fontSize: 13, marginBottom: 2 }}>
                    {item.quantity}× {item.name}
                  </Text>
                ))}
                {order.deliveryNotes && (
                  <Text style={{ color: Colors.empire.warning, fontSize: 12, marginTop: 6, fontWeight: '600' }}>
                    Note: {order.deliveryNotes}
                  </Text>
                )}
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 17 }}>R{order.total.toFixed(0)}</Text>
                {action && (
                  <Pressable
                    onPress={action.onPress}
                    disabled={action.loading}
                    style={{ backgroundColor: Colors.gold[500], paddingVertical: 10, paddingHorizontal: 18, borderRadius: 14 }}
                  >
                    {action.loading
                      ? <ActivityIndicator color={Colors.empire.black} size="small" />
                      : <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 13 }}>{action.label}</Text>}
                  </Pressable>
                )}
                {order.status === 'ready' && (
                  <Text style={{ color: Colors.empire.success, fontWeight: '700', fontSize: 13 }}>Awaiting driver</Text>
                )}
              </View>
            </View>
          );
        })}
        {!isLoading && (orders ?? []).length === 0 && (
          <Text style={{ color: '#bbb', textAlign: 'center', fontSize: 14, paddingVertical: 40 }}>No orders found</Text>
        )}
      </ScrollView>
    </View>
  );
}

function statusLabel(s: string) {
  const m: Record<string, string> = { placed: 'New', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready' };
  return m[s] ?? s;
}
function statusBg(s: string) {
  const m: Record<string, string> = { placed: '#FFF3E0', confirmed: '#E3F2FD', preparing: '#F3E5F5', ready: '#E8F5E9' };
  return m[s] ?? Colors.surface[100];
}
function statusFg(s: string) {
  const m: Record<string, string> = { placed: '#E65100', confirmed: '#1565C0', preparing: '#6A1B9A', ready: '#2E7D32' };
  return m[s] ?? '#888';
}
