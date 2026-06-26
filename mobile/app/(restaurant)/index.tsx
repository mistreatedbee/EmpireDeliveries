import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrendingUp, ShoppingBag, Clock, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { restaurantManagementService, RestaurantOrder } from '@/services/restaurant-management.service';
import { BarChart } from '@/components/ui/BarChart';
import { Colors } from '@/constants/colors';

export default function RestaurantDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['restaurant', 'stats'],
    queryFn: restaurantManagementService.getStats,
    refetchInterval: 30000,
  });

  const { data: activeOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['restaurant', 'orders', 'active'],
    queryFn: () => restaurantManagementService.getOrders('placed,confirmed,preparing'),
    refetchInterval: 10000,
  });

  const { data: analytics } = useQuery({
    queryKey: ['restaurant', 'analytics'],
    queryFn: restaurantManagementService.getAnalytics,
    staleTime: 5 * 60 * 1000,
  });

  const confirmMutation = useMutation({
    mutationFn: restaurantManagementService.confirmOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'orders'] });
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'stats'] });
    },
  });

  const newOrders = (activeOrders ?? []).filter((o) => o.status === 'placed');
  const inProgressOrders = (activeOrders ?? []).filter((o) => ['confirmed', 'preparing'].includes(o.status));

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 }}>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Welcome back,</Text>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>{user?.firstName ?? 'Restaurant'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {statsLoading ? (
            <View style={{ flex: 1, alignItems: 'center' }}><ActivityIndicator color={Colors.gold[500]} /></View>
          ) : (
            [
              { label: "Today's Orders", value: String(stats?.ordersToday ?? 0), Icon: ShoppingBag },
              { label: 'Revenue', value: `R${(stats?.revenueToday ?? 0).toFixed(0)}`, Icon: TrendingUp },
              { label: 'Active', value: String(stats?.activeOrders ?? 0), Icon: Clock },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surface[200] }}>
                <s.Icon size={18} color={Colors.gold[500]} />
                <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 17, marginTop: 6 }}>{s.value}</Text>
                <Text style={{ color: '#aaa', fontSize: 10, marginTop: 3, textAlign: 'center' }}>{s.label}</Text>
              </View>
            ))
          )}
        </View>

        {/* Weekly analytics */}
        {analytics && (
          <>
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.surface[200] }}>
              <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 4 }}>This Week</Text>
              {analytics.weeklyData.length > 0 ? (
                <BarChart
                  data={analytics.weeklyData.map((d) => ({ label: d.day, value: d.orders }))}
                  barColor={Colors.gold[500]}
                  height={150}
                  formatValue={(v) => String(v)}
                />
              ) : (
                <Text style={{ color: '#bbb', fontSize: 13, textAlign: 'center', paddingVertical: 12 }}>No order data yet</Text>
              )}
            </View>

            {analytics.topItems.length > 0 && (
              <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: Colors.surface[200] }}>
                <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Top Items (30 days)</Text>
                {analytics.topItems.map((item, i) => {
                  const maxCount = analytics.topItems[0]?.orderCount ?? 1;
                  return (
                    <View key={item.name} style={{ marginBottom: i < analytics.topItems.length - 1 ? 12 : 0 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.empire.black, flex: 1, marginRight: 8 }} numberOfLines={1}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: '#888', fontWeight: '700' }}>{item.orderCount} orders</Text>
                      </View>
                      <View style={{ backgroundColor: Colors.surface[100], borderRadius: 4, height: 4 }}>
                        <View style={{ width: `${(item.orderCount / maxCount) * 100}%`, backgroundColor: Colors.gold[500], borderRadius: 4, height: 4 }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {/* New orders */}
        {newOrders.length > 0 && (
          <>
            <Text style={{ fontWeight: '800', fontSize: 16, color: Colors.empire.black, marginBottom: 10 }}>New Orders</Text>
            {newOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                action={{ label: 'Confirm Order', onPress: () => confirmMutation.mutate(order.id), loading: confirmMutation.isPending }}
                highlight
              />
            ))}
          </>
        )}

        {/* In-progress orders */}
        {inProgressOrders.length > 0 && (
          <>
            <Text style={{ fontWeight: '800', fontSize: 16, color: Colors.empire.black, marginBottom: 10, marginTop: 8 }}>In Progress</Text>
            {inProgressOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </>
        )}

        {ordersLoading && <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 20 }} />}
        {!ordersLoading && (activeOrders ?? []).length === 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.surface[200] }}>
            <CheckCircle size={36} color="#bbb" />
            <Text style={{ color: '#888', fontSize: 15, marginTop: 12, textAlign: 'center' }}>No active orders right now</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function OrderCard({ order, action, highlight }: {
  order: RestaurantOrder;
  action?: { label: string; onPress: () => void; loading?: boolean };
  highlight?: boolean;
}) {
  const timeAgo = formatTimeAgo(order.placedAt);
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 10, borderWidth: highlight ? 2 : 1, borderColor: highlight ? Colors.gold[500] : Colors.surface[200] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 14 }}>{order.customerName}</Text>
          <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{timeAgo}</Text>
        </View>
        <View style={{ backgroundColor: statusColor(order.status) + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
          <Text style={{ color: statusColor(order.status), fontWeight: '700', fontSize: 12 }}>{statusLabel(order.status)}</Text>
        </View>
      </View>
      <Text style={{ color: '#666', fontSize: 13, marginBottom: 10 }} numberOfLines={2}>
        {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 16 }}>R{order.total.toFixed(0)}</Text>
        {action && (
          <Pressable
            onPress={action.onPress}
            disabled={action.loading}
            style={{ backgroundColor: Colors.gold[500], paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 }}
          >
            {action.loading
              ? <ActivityIndicator color={Colors.empire.black} size="small" />
              : <Text style={{ color: Colors.empire.black, fontWeight: '800', fontSize: 13 }}>{action.label}</Text>}
          </Pressable>
        )}
      </View>
    </View>
  );
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { placed: 'New', confirmed: 'Confirmed', preparing: 'Preparing', ready: 'Ready' };
  return map[status] ?? status;
}

function statusColor(status: string): string {
  const map: Record<string, string> = { placed: '#E65100', confirmed: '#1565C0', preparing: '#6A1B9A', ready: '#2E7D32' };
  return map[status] ?? '#888';
}

function formatTimeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${Math.floor(diff)}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}
