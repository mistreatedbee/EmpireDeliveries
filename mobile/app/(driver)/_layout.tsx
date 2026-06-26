import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Wallet, User } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';

export default function DriverLayout() {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/(auth)/login');
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.empire.black,
          borderTopColor: Colors.empire.charcoal,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold[500],
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color }) => <TrendingUp size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <Wallet size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="delivery" options={{ href: null }} />
      <Tabs.Screen name="bank-account" options={{ href: null }} />
      <Tabs.Screen name="vehicle-details" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="documents" options={{ href: null }} />
    </Tabs>
  );
}
