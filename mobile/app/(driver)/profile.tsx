import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth.service';
import { Colors } from '@/constants/colors';

const MENU = [
  { label: 'Documents', icon: '📄' },
  { label: 'Vehicle Details', icon: '🚗' },
  { label: 'Support', icon: '💬' },
  { label: 'Settings', icon: '⚙️' },
];

export default function DriverProfile() {
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => {
          try { await authService.logout(); } catch {}
          await clearAuth();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.surface[100] }}>
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 56, paddingBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.surface[200], borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <Text style={{ fontSize: 30 }}>🚴</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 17 }}>{user?.firstName} {user?.lastName}</Text>
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{user?.phone}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Text style={{ color: Colors.gold[500], fontSize: 13 }}>★</Text>
              <Text style={{ fontWeight: '700', fontSize: 13, color: Colors.empire.black }}>4.8</Text>
              <Text style={{ color: '#aaa', fontSize: 12 }}>(1,249 ratings)</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[{ label: 'Total Trips', value: '1,249' }, { label: 'This Month', value: '152' }, { label: 'Completion', value: '98%' }].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
              <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 18 }}>{s.value}</Text>
              <Text style={{ color: '#aaa', fontSize: 11, marginTop: 4, textAlign: 'center' }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 16 }}>
          {MENU.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => Alert.alert(item.label, `${item.label} coming soon.`)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100] }}
            >
              <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>{item.label}</Text>
              <Text style={{ color: Colors.surface[300], fontSize: 18 }}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleLogout} style={{ borderRadius: 16, borderWidth: 2, borderColor: Colors.empire.error, paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ color: Colors.empire.error, fontWeight: '800', fontSize: 15 }}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
