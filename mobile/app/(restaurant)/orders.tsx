import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { MessageCircle, Car, X } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantManagementService, RestaurantOrder } from '@/services/restaurant-management.service';
import { useOrderConversation } from '@/hooks/useChat';
import { useUIStore } from '@/stores/uiStore';
import { getUserErrorMessage } from '@/utils/errorHandler';
import { Colors } from '@/constants/colors';

type Filter = 'all' | 'placed' | 'preparing' | 'ready' | 'history';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'placed', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'history', label: 'History' },
];

export default function RestaurantOrders() {
  const [filter, setFilter] = useState<Filter>('all');
  const [cancelTarget, setCancelTarget] = useState<RestaurantOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const statusParam =
    filter === 'all' ? 'placed,confirmed,preparing,ready'
    : filter === 'history' ? 'delivered,cancelled'
    : filter;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['restaurant', 'orders', filter],
    queryFn: () => restaurantManagementService.getOrders(statusParam),
    refetchInterval: 8000,
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
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => restaurantManagementService.cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] });
      setCancelTarget(null);
      setCancelReason('');
      showToast('Order cancelled', 'success');
    },
    onError: (error) => showToast(getUserErrorMessage(error, 'Could not cancel this order.'), 'error'),
  });

  function getAction(order: RestaurantOrder) {
    if (order.status === 'placed') return { label: 'Confirm', onPress: () => confirmMutation.mutate(order.id), loading: confirmMutation.isPending };
    if (order.status === 'confirmed') return { label: 'Mark Preparing', onPress: () => preparingMutation.mutate(order.id), loading: preparingMutation.isPending };
    if (order.status === 'preparing') return { label: 'Mark Ready', onPress: () => readyMutation.mutate(order.id), loading: readyMutation.isPending };
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <Modal visible={!!cancelTarget} transparent animationType="fade" onRequestClose={() => setCancelTarget(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontWeight: '800', fontSize: 17, color: Colors.empire.black }}>Cancel order</Text>
              <Pressable onPress={() => setCancelTarget(null)} hitSlop={8}>
                <X size={20} color={Colors.empire.black} />
              </Pressable>
            </View>
            <Text style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
              Reason for cancelling {cancelTarget?.customerName}'s order (e.g. item out of stock) — the customer will see this.
            </Text>
            <TextInput
              value={cancelReason}
              onChangeText={setCancelReason}
              placeholder="Reason..."
              placeholderTextColor="#999"
              multiline
              style={{ backgroundColor: Colors.surface[100], borderRadius: 10, padding: 12, color: Colors.empire.black, marginBottom: 16, minHeight: 70, textAlignVertical: 'top' }}
            />
            <Pressable
              onPress={() => cancelTarget && cancelReason.trim() && cancelMutation.mutate({ id: cancelTarget.id, reason: cancelReason.trim() })}
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              style={{ backgroundColor: '#FFEBEE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: cancelReason.trim() ? 1 : 0.5 }}
            >
              {cancelMutation.isPending
                ? <ActivityIndicator color={Colors.empire.error} size="small" />
                : <Text style={{ color: Colors.empire.error, fontWeight: '800' }}>Cancel Order</Text>}
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Orders</Text>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        style={{ backgroundColor: Colors.empire.black, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={{ paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: filter === f.id ? Colors.gold[500] : Colors.empire.charcoal }}
          >
            <Text style={{ color: filter === f.id ? Colors.empire.black : '#aaa', fontWeight: '700', fontSize: 13 }}>{f.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {isLoading && <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 20 }} />}
        {!isLoading && (orders ?? []).map((order) => (
          <RestaurantOrderCard
            key={order.id}
            order={order}
            action={getAction(order)}
            onCancel={['placed', 'confirmed', 'preparing'].includes(order.status) ? () => setCancelTarget(order) : undefined}
          />
        ))}
        {!isLoading && (orders ?? []).length === 0 && (
          <Text style={{ color: '#bbb', textAlign: 'center', fontSize: 14, paddingVertical: 40 }}>No orders found</Text>
        )}
      </ScrollView>
    </View>
  );
}

function RestaurantOrderCard({
  order,
  action,
  onCancel,
}: {
  order: RestaurantOrder;
  action: { label: string; onPress: () => void; loading: boolean } | null;
  onCancel?: () => void;
}) {
  const { data: customerConversation } = useOrderConversation(order.id, 'customer_restaurant');
  const { data: driverConversation } = useOrderConversation(order.id, 'driver_restaurant');

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.surface[200] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <View>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15 }}>{order.customerName}</Text>
          <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{order.customerPhone}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={() => {
              if (!customerConversation) return;
              router.push({ pathname: '/(modals)/chat/[conversationId]', params: { conversationId: customerConversation.id, title: order.customerName } });
            }}
            disabled={!customerConversation}
            style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center', opacity: customerConversation ? 1 : 0.4 }}
          >
            <MessageCircle size={15} color={Colors.empire.black} />
          </Pressable>
          {driverConversation && (
            <Pressable
              onPress={() => router.push({ pathname: '/(modals)/chat/[conversationId]', params: { conversationId: driverConversation.id, title: 'Driver' } })}
              style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.surface[100], alignItems: 'center', justifyContent: 'center' }}
            >
              <Car size={15} color={Colors.empire.black} />
            </Pressable>
          )}
          <View style={{ backgroundColor: statusBg(order.status), paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: statusFg(order.status), fontWeight: '700', fontSize: 12 }}>{statusLabel(order.status)}</Text>
          </View>
        </View>
      </View>

      {/* Items */}
      <View style={{ backgroundColor: Colors.surface[100], borderRadius: 12, padding: 12, marginBottom: 10 }}>
        {order.items.map((item, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <Text style={{ color: '#555', fontSize: 13 }}>
              {item.quantity}× {item.name}
            </Text>
            {!!item.addons?.length && (
              <Text style={{ color: '#999', fontSize: 12, marginTop: 1 }}>
                + {item.addons.map((a) => a.name).join(', ')}
              </Text>
            )}
          </View>
        ))}
        {order.deliveryNotes && (
          <Text style={{ color: Colors.empire.warning, fontSize: 12, marginTop: 6, fontWeight: '600' }}>
            Note: {order.deliveryNotes}
          </Text>
        )}
        {order.distanceKm != null && (
          <Text style={{ color: '#999', fontSize: 12, marginTop: 6 }}>
            {order.distanceKm.toFixed(1)} km to customer
          </Text>
        )}
      </View>

      {/* Price breakdown */}
      {order.subtotal != null && (
        <View style={{ marginBottom: 10 }}>
          {[
            ['Subtotal', order.subtotal],
            ['Delivery Fee', order.deliveryFee ?? 0],
            ['Service Fee', order.serviceFee ?? 0],
            ...(order.discount ? [['Discount', -order.discount] as const] : []),
          ].map(([label, value]) => (
            <View key={label as string} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ color: '#999', fontSize: 12 }}>{label}</Text>
              <Text style={{ color: '#999', fontSize: 12 }}>
                {(value as number) < 0 ? '-' : ''}R{Math.abs(value as number).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}

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
        {order.status === 'delivered' && (
          <Text style={{ color: Colors.empire.success, fontWeight: '700', fontSize: 13 }}>Delivered</Text>
        )}
        {order.status === 'cancelled' && (
          <Text style={{ color: Colors.empire.error, fontWeight: '700', fontSize: 13 }}>Cancelled</Text>
        )}
      </View>
      {onCancel && (
        <Pressable onPress={onCancel} style={{ marginTop: 10, alignItems: 'center' }}>
          <Text style={{ color: Colors.empire.error, fontWeight: '700', fontSize: 12 }}>Cancel Order</Text>
        </Pressable>
      )}
    </View>
  );
}

function statusLabel(s: string) {
  const m: Record<string, string> = { placed: 'New', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled' };
  return m[s] ?? s;
}
function statusBg(s: string) {
  const m: Record<string, string> = { placed: '#FFF3E0', confirmed: '#E3F2FD', preparing: '#F3E5F5', ready: '#E8F5E9', delivered: '#E8F5E9', cancelled: '#FFEBEE' };
  return m[s] ?? Colors.surface[100];
}
function statusFg(s: string) {
  const m: Record<string, string> = { placed: '#E65100', confirmed: '#1565C0', preparing: '#6A1B9A', ready: '#2E7D32', delivered: '#2E7D32', cancelled: '#C62828' };
  return m[s] ?? '#888';
}
