import { Tabs } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, TrendingUp, Wallet, User } from 'lucide-react-native';
import { useAuthGate } from '@/hooks/useAuthGate';
import { Colors } from '@/constants/colors';
import { tabBarStyle } from '@/utils/tabBar';

export default function DriverLayout() {
  const insets = useSafeAreaInsets();
  const { allowed, isLoading, isAuthenticated } = useAuthGate();

  if (isLoading || !isAuthenticated || !allowed) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabBarStyle(insets, {
          backgroundColor: Colors.empire.black,
          borderColor: Colors.empire.charcoal,
        }),
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
