import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, Wallet } from 'lucide-react-native';
import { adminService } from '@/services/admin.service';
import { Input } from '@/components/empire';
import { Colors } from '@/constants/colors';

export default function AdminCustomersScreen() {
  const [search, setSearch] = useState('');
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin', 'customers', search],
    queryFn: () => adminService.getCustomersOverview(search || undefined),
    refetchInterval: 30000,
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.empire.charcoal }}>
        <Text style={{ color: '#888', fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>ADMIN PORTAL</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Customers</Text>
        <View style={{ marginTop: 12 }}>
          <Input value={search} onChangeText={setSearch} placeholder="Search customers..." autoCapitalize="none" />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {customers.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>No customers found</Text>
          ) : customers.map((c) => (
            <View key={c.id} style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{c.firstName} {c.lastName}</Text>
              <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{c.email}</Text>

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {[
                  { icon: ShoppingBag, label: 'Orders', value: String(c.ordersTotal) },
                  { icon: Users, label: 'Today', value: String(c.ordersToday) },
                  { icon: Wallet, label: 'Spent', value: `R${c.spentTotal.toFixed(0)}` },
                ].map(({ icon: Icon, label, value }) => (
                  <View key={label} style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                    <Icon size={14} color={Colors.gold[500]} />
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14, marginTop: 4 }}>{value}</Text>
                    <Text style={{ color: '#666', fontSize: 10, marginTop: 2 }}>{label}</Text>
                  </View>
                ))}
              </View>

              <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
                Wallet R{c.walletBalance.toFixed(2)} · Joined {new Date(c.createdAt).toLocaleDateString('en-ZA')}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
