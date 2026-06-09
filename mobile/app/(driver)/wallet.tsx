import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Colors } from '@/constants/colors';

const TRANSACTIONS = [
  { label: 'Delivery payout', time: 'Today 14:22', amount: '+R38', positive: true },
  { label: 'Delivery payout', time: 'Today 12:08', amount: '+R42', positive: true },
  { label: 'Withdrawal to FNB', time: 'Yesterday', amount: '-R500', positive: false },
  { label: 'Delivery payout', time: 'Yesterday 18:30', amount: '+R55', positive: true },
  { label: 'Delivery payout', time: 'Yesterday 15:10', amount: '+R40', positive: true },
];

export default function DriverWallet() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Wallet</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Balance card */}
        <View style={{ borderRadius: 24, padding: 24, backgroundColor: Colors.gold[500], marginBottom: 16 }}>
          <Text style={{ color: 'rgba(10,10,10,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Available Balance</Text>
          <Text style={{ color: Colors.empire.black, fontSize: 40, fontWeight: '900', marginTop: 4 }}>R2,840</Text>
          <Pressable
            onPress={() => Alert.alert('Withdraw', 'Withdrawal feature coming soon.')}
            style={{ marginTop: 20, backgroundColor: Colors.empire.black, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 16, alignSelf: 'flex-start' }}
          >
            <Text style={{ color: Colors.gold[500], fontWeight: '800', fontSize: 14 }}>Withdraw to Bank</Text>
          </Pressable>
        </View>

        {/* Bank account */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Bank Account</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface[100], borderRadius: 16, padding: 12 }}>
            <View style={{ width: 42, height: 42, backgroundColor: Colors.empire.black, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ color: Colors.gold[500], fontWeight: '900', fontSize: 11 }}>FNB</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', color: Colors.empire.black, fontSize: 14 }}>FNB Cheque Account</Text>
              <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>**** **** 4892</Text>
            </View>
            <Pressable onPress={() => Alert.alert('Change Bank', 'Bank account management coming soon.')}>
              <Text style={{ color: Colors.gold[600], fontWeight: '700', fontSize: 13 }}>Change</Text>
            </Pressable>
          </View>
        </View>

        {/* Transactions */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontWeight: '800', color: Colors.empire.black, fontSize: 15, marginBottom: 12 }}>Recent Transactions</Text>
          {TRANSACTIONS.map((t, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < TRANSACTIONS.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100] }}>
              <View>
                <Text style={{ fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>{t.label}</Text>
                <Text style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{t.time}</Text>
              </View>
              <Text style={{ fontWeight: '800', fontSize: 14, color: t.positive ? Colors.empire.success : Colors.empire.error }}>{t.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
