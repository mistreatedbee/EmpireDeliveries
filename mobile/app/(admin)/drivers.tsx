import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Truck, Wallet, TrendingUp } from 'lucide-react-native';
import { adminService } from '@/services/admin.service';
import { Colors } from '@/constants/colors';

export default function AdminDriversScreen() {
  const { data: drivers = [], isLoading } = useQuery({
    queryKey: ['admin', 'drivers'],
    queryFn: () => adminService.getDriversOverview(),
    refetchInterval: 30000,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Drivers</Text>
        <Text style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Earnings, trips & withdrawal status</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {drivers.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No drivers yet</Text>
          ) : drivers.map((d) => (
            <View key={d.id} style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{d.firstName} {d.lastName}</Text>
                  <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{d.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: d.isOnline ? '#4ade80' : '#666' }} />
                  <Text style={{ color: d.isOnline ? '#4ade80' : '#888', fontSize: 11, fontWeight: '700' }}>
                    {d.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                {[
                  { icon: Truck, label: 'Trips today', value: String(d.tripsToday) },
                  { icon: TrendingUp, label: 'Today', value: `R${d.earningsToday.toFixed(0)}` },
                  { icon: Wallet, label: 'Wallet', value: `R${d.walletBalance.toFixed(0)}` },
                ].map(({ icon: Icon, label, value }) => (
                  <View key={label} style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                    <Icon size={14} color={Colors.gold[500]} />
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, marginTop: 4 }}>{value}</Text>
                    <Text style={{ color: '#666', fontSize: 10, marginTop: 2 }}>{label}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#888', fontSize: 12 }}>Total earned · {d.totalTrips} trips · {d.rating.toFixed(1)}★</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>R{d.earningsTotal.toFixed(0)}</Text>
              </View>

              {d.pendingWithdrawal != null && d.pendingWithdrawal > 0 && (
                <View style={{ marginTop: 10, backgroundColor: '#f9731622', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#f9731644' }}>
                  <Text style={{ color: '#f97316', fontWeight: '800', fontSize: 13 }}>
                    Pending withdrawal: R{d.pendingWithdrawal.toFixed(2)}
                  </Text>
                  {d.bankAccountNo && (
                    <Text style={{ color: '#888', fontSize: 11, marginTop: 4 }}>
                      {d.bankName} ····{String(d.bankAccountNo).slice(-4)} · {d.bankHolderName}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
