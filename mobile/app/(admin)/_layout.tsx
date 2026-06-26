import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';
import { LayoutDashboard, ClipboardList, Users } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';

export default function AdminLayout() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, user?.role]);

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
    </Tabs>
  );
}
