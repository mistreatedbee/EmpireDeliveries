import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Bike, FileText, Car, MessageCircle, Settings, Star, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth.service';
import { driverService } from '@/services/driver.service';
import { Colors } from '@/constants/colors';

const MENU: Array<{ label: string; Icon: React.ComponentType<{ size: number; color: string }>; onPress?: () => void }> = [
  { label: 'Documents', Icon: FileText, onPress: () => router.push('/(driver)/documents') },
  { label: 'Vehicle Details', Icon: Car, onPress: () => router.push('/(driver)/vehicle-details') },
  { label: 'Support', Icon: MessageCircle, onPress: () => router.push('/(driver)/support') },
  { label: 'Settings', Icon: Settings, onPress: () => router.push('/(driver)/settings') },
];

export default function DriverProfile() {
  const { user, clearAuth } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['driver', 'stats'],
    queryFn: driverService.getStats,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['driver', 'profile'],
    queryFn: driverService.getProfile,
  });

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
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
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.surface[200] }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: Colors.surface[200], borderWidth: 2, borderColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <Bike size={30} color={Colors.gold[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 17 }}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{user?.phone}</Text>
            {profileLoading ? (
              <ActivityIndicator color={Colors.gold[500]} style={{ marginTop: 4 }} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Star size={13} color={Colors.gold[500]} fill={Colors.gold[500]} />
                <Text style={{ fontWeight: '700', fontSize: 13, color: Colors.empire.black }}>
                  {(profile?.rating ?? 0).toFixed(1)}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 12 }}>({profile?.reviewCount ?? 0} ratings)</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {statsLoading || profileLoading ? (
            <View style={{ flex: 1, alignItems: 'center' }}><ActivityIndicator color={Colors.gold[500]} /></View>
          ) : (
            [
              { label: 'Total Trips', value: String(profile?.totalTrips ?? 0) },
              { label: 'Today', value: String(stats?.trips ?? 0) },
              { label: 'Completion', value: `${(profile?.completionRate ?? 100).toFixed(0)}%` },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.surface[200] }}>
                <Text style={{ fontWeight: '900', color: Colors.empire.black, fontSize: 18 }}>{s.value}</Text>
                <Text style={{ color: '#aaa', fontSize: 11, marginTop: 4, textAlign: 'center' }}>{s.label}</Text>
              </View>
            ))
          )}
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: Colors.surface[200], marginBottom: 16 }}>
          {MENU.map((item, i) => {
            const IconComp = item.Icon;
            return (
              <Pressable
                key={item.label}
                onPress={item.onPress ?? (() => Alert.alert(item.label, `${item.label} coming soon.`))}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: Colors.surface[100] }}
              >
                <View style={{ width: 36, height: 36, backgroundColor: Colors.surface[100], borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  <IconComp size={18} color={Colors.empire.black} />
                </View>
                <Text style={{ flex: 1, fontWeight: '600', color: Colors.empire.black, fontSize: 14 }}>{item.label}</Text>
                <ChevronRight size={16} color={Colors.surface[300]} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={handleLogout}
          style={{ borderRadius: 16, borderWidth: 2, borderColor: Colors.empire.error, paddingVertical: 16, alignItems: 'center' }}
        >
          <Text style={{ color: Colors.empire.error, fontWeight: '800', fontSize: 15 }}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
