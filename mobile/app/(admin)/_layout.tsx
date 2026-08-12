import { Tabs } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutDashboard, ClipboardList, Users, MessageCircle } from 'lucide-react-native';
import { useAuthGate } from '@/hooks/useAuthGate';
import { Colors } from '@/constants/colors';
import { tabBarStyle } from '@/utils/tabBar';

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  const { allowed, isLoading, isAuthenticated } = useAuthGate({ requiredRole: 'admin' });

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
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support-inbox"
        options={{
          title: 'Support',
          tabBarIcon: ({ color }) => <MessageCircle size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
