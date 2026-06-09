import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { authService } from '@/services/auth.service';
import { queryKeys } from '@/constants/queryKeys';
import { Colors } from '@/constants/colors';

interface MenuItem {
  emoji: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const { user, clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: authService.getMe,
    initialData: user ?? undefined,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: async () => {
      await clearAuth();
      clearCart();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });

  const menus: MenuItem[] = [
    { emoji: '✏️', label: 'Edit Profile', subtitle: 'Name, email, phone', onPress: () => router.push('/(customer)/(profile)/edit') },
    { emoji: '📍', label: 'Saved Addresses', subtitle: 'Manage delivery locations', onPress: () => router.push('/(customer)/(profile)/addresses') },
    { emoji: '💳', label: 'Payment Methods', subtitle: 'Cards and wallets', onPress: () => router.push('/(customer)/(profile)/payment-methods') },
    { emoji: '🏆', label: 'Loyalty & Rewards', subtitle: 'Empire Points balance', onPress: () => {} },
    { emoji: '⚙️', label: 'Settings', subtitle: 'Preferences and notifications', onPress: () => router.push('/(customer)/(profile)/settings') },
    { emoji: '❓', label: 'Help & Support', onPress: () => {} },
    { emoji: '🔒', label: 'Privacy Policy', onPress: () => {} },
    { emoji: '🚪', label: 'Sign Out', onPress: () => logoutMutation.mutate(), danger: true },
  ];

  const name = profile ? `${profile.firstName} ${profile.lastName}` : user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <ScreenWrapper bg="surface">
      <View style={{ backgroundColor: Colors.empire.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginBottom: 20 }}>Profile</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Avatar uri={profile?.profileImage} name={name} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900' }}>{name}</Text>
            <Text style={{ color: '#888', fontSize: 14, marginTop: 2 }}>{profile?.email ?? user?.email}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(customer)/(profile)/edit')}
            style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 12, padding: 10 }}
          >
            <Text style={{ fontSize: 16 }}>✏️</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Loyalty card */}
        <View style={{ backgroundColor: Colors.empire.charcoal, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: Colors.gold[700] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: Colors.gold[500], fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>EMPIRE REWARDS</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 4 }}>0 pts</Text>
              <Text style={{ color: '#888', fontSize: 13 }}>Bronze Member</Text>
            </View>
            <Text style={{ fontSize: 40 }}>👑</Text>
          </View>
          <View style={{ marginTop: 16, backgroundColor: Colors.empire.black, borderRadius: 8, height: 6, overflow: 'hidden' }}>
            <View style={{ width: '10%', height: '100%', backgroundColor: Colors.gold[500], borderRadius: 8 }} />
          </View>
          <Text style={{ color: '#888', fontSize: 12, marginTop: 6 }}>500 pts to Silver</Text>
        </View>

        {/* Menu items */}
        <View style={{ backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' }}>
          {menus.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < menus.length - 1 ? 1 : 0, borderBottomColor: '#F0F0F0', gap: 12 }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.danger ? '#FFF0F0' : '#F8F8F8', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: item.danger ? Colors.empire.error : Colors.empire.black }}>{item.label}</Text>
                {item.subtitle && <Text style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{item.subtitle}</Text>}
              </View>
              {!item.danger && <Text style={{ color: '#CCC', fontSize: 18 }}>›</Text>}
            </Pressable>
          ))}
        </View>

        <Text style={{ textAlign: 'center', color: '#AAA', fontSize: 12, marginTop: 20 }}>
          Empire Deliveries v1.0.0
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
