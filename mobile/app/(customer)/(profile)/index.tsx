import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, MapPin, CreditCard, Wallet, Award, Settings, HelpCircle, Lock, LogOut, ChevronRight, Heart, Shield } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { authService } from '@/services/auth.service';
import { queryKeys } from '@/constants/queryKeys';
import { T } from '@/constants/colors';

interface MenuEntry {
  Icon: React.ComponentType<{ size: number; color: string }>;
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

  const menus: MenuEntry[] = [
    { Icon: Pencil, label: 'Edit Profile', subtitle: 'Name, email, phone', onPress: () => router.push('/(customer)/(profile)/edit') },
    { Icon: MapPin, label: 'Saved Addresses', subtitle: 'Manage delivery locations', onPress: () => router.push('/(customer)/(profile)/addresses') },
    { Icon: CreditCard, label: 'Payment Methods', subtitle: 'Cards and wallets', onPress: () => router.push('/(customer)/(profile)/payment-methods') },
    { Icon: Wallet, label: 'Empire Wallet', subtitle: 'Balance and top-ups', onPress: () => router.push('/(customer)/(profile)/wallet') },
    { Icon: Heart, label: 'Favourites', subtitle: 'Saved restaurants', onPress: () => router.push('/(customer)/(profile)/favourites') },
    { Icon: Award, label: 'Loyalty & Rewards', subtitle: 'Empire Points balance', onPress: () => router.push('/(customer)/(profile)/loyalty') },
    { Icon: Settings, label: 'Settings', subtitle: 'Preferences and notifications', onPress: () => router.push('/(customer)/(profile)/settings') },
    { Icon: Lock, label: 'Change Password', subtitle: 'Update your account password', onPress: () => router.push('/(customer)/(profile)/change-password') },
    { Icon: HelpCircle, label: 'Help & Support', onPress: () => router.push('/(customer)/(profile)/support') },
    { Icon: Shield, label: 'Privacy Policy', onPress: () => router.push('/(customer)/(profile)/privacy') },
    { Icon: LogOut, label: 'Sign Out', onPress: () => logoutMutation.mutate(), danger: true },
  ];

  const name = profile ? `${profile.firstName} ${profile.lastName}` : user ? `${user.firstName} ${user.lastName}` : '';

  return (
    <ScreenWrapper bg="white">
      {/* White header */}
      <View style={{ backgroundColor: T.bg, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: T.border }}>
        <Text style={{ color: T.text, fontSize: 22, fontWeight: '900', marginBottom: 16 }}>Account</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar uri={profile?.profileImage} name={name} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: T.text, fontSize: 18, fontWeight: '800' }}>{name}</Text>
            <Text style={{ color: T.textSec, fontSize: 14, marginTop: 2 }}>{profile?.email ?? user?.email}</Text>
          </View>
          <Pressable
            onPress={() => router.push('/(customer)/(profile)/edit')}
            style={{ backgroundColor: T.surface, borderRadius: 10, padding: 9, borderWidth: 1, borderColor: T.border }}
          >
            <Pencil size={16} color={T.textSec} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Loyalty card — gold is preserved here as a brand moment */}
        <View style={{ backgroundColor: '#1C1C1C', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#C9A227' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: '#C9A227', fontSize: 11, fontWeight: '700', letterSpacing: 2 }}>EMPIRE REWARDS</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 4 }}>0 pts</Text>
              <Text style={{ color: '#888', fontSize: 13 }}>Bronze Member</Text>
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#C9A22722', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={24} color="#C9A227" />
            </View>
          </View>
          <View style={{ marginTop: 16, backgroundColor: '#0A0A0A', borderRadius: 8, height: 5, overflow: 'hidden' }}>
            <View style={{ width: '10%', height: '100%', backgroundColor: '#C9A227', borderRadius: 8 }} />
          </View>
          <Text style={{ color: '#888', fontSize: 12, marginTop: 6 }}>500 pts to Silver</Text>
        </View>

        {/* Menu items */}
        <View style={{ backgroundColor: T.bg, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: T.border }}>
          {menus.map((item, i) => {
            const IconComp = item.Icon;
            const isLast = i === menus.length - 1;
            return (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: T.border, gap: 12 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.danger ? T.dangerBg : T.surface, alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp size={18} color={item.danger ? T.danger : T.textSec} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: item.danger ? T.danger : T.text }}>{item.label}</Text>
                  {item.subtitle && <Text style={{ fontSize: 12, color: T.textSec, marginTop: 1 }}>{item.subtitle}</Text>}
                </View>
                {!item.danger && <ChevronRight size={16} color={T.textTer} />}
              </Pressable>
            );
          })}
        </View>

        <Text style={{ textAlign: 'center', color: T.textTer, fontSize: 12, marginTop: 20 }}>
          Empire Deliveries v1.0.0
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
