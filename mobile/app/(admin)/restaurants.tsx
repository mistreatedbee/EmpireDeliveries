import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Store, ShoppingBag, Wallet } from 'lucide-react-native';
import { adminService } from '@/services/admin.service';
import { Colors } from '@/constants/colors';

export default function AdminRestaurantsScreen() {
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['admin', 'restaurants'],
    queryFn: () => adminService.getRestaurantsOverview(),
    refetchInterval: 30000,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Restaurants</Text>
        <Text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Sales, wallet balance & payouts</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {restaurants.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No restaurants yet</Text>
          ) : restaurants.map((r) => (
            <View key={r.id} style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#4ade8022', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={18} color="#4ade80" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{r.name}</Text>
                  <Text style={{ color: '#888', fontSize: 12 }}>{r.ownerName} · {r.ownerEmail}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                {[
                  { icon: ShoppingBag, label: 'Orders today', value: String(r.ordersToday) },
                  { icon: Store, label: 'Revenue today', value: `R${r.revenueToday.toFixed(0)}` },
                  { icon: Wallet, label: 'Wallet', value: `R${r.walletBalance.toFixed(0)}` },
                ].map(({ icon: Icon, label, value }) => (
                  <View key={label} style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                    <Icon size={14} color={Colors.gold[500]} />
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13, marginTop: 4 }}>{value}</Text>
                    <Text style={{ color: '#666', fontSize: 10, marginTop: 2, textAlign: 'center' }}>{label}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ color: '#666', fontSize: 12 }}>{r.ordersTotal} total orders · {r.isActive ? 'Active' : 'Inactive'}</Text>

              {r.pendingWithdrawal != null && r.pendingWithdrawal > 0 && (
                <View style={{ marginTop: 10, backgroundColor: '#f9731622', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#f9731644' }}>
                  <Text style={{ color: '#f97316', fontWeight: '800', fontSize: 13 }}>
                    Pending withdrawal: R{r.pendingWithdrawal.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
