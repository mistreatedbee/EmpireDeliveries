import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, ShoppingBag, Bell, User } from 'lucide-react-native';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthGate } from '@/hooks/useAuthGate';
import { T } from '@/constants/colors';
import { tabBarStyle } from '@/utils/tabBar';

function TabIcon({
  Icon,
  focused,
  badge,
}: {
  Icon: React.ComponentType<{ size: number; color: string }>;
  focused: boolean;
  badge?: number;
}) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={22} color={focused ? T.action : T.textTer} />
      {!!badge && badge > 0 && (
        <View
          style={{
            position: 'absolute', top: -5, right: -10,
            backgroundColor: T.danger, borderRadius: 10,
            minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '800' }}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function CustomerLayout() {
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotificationStore();
  const { allowed, isLoading, isAuthenticated } = useAuthGate();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={T.action} />
      </View>
    );
  }

  if (!isAuthenticated || !allowed) {
    return (
      <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={T.action} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: tabBarStyle(insets, { backgroundColor: T.bg, borderColor: T.border }),
        tabBarActiveTintColor: T.action,
        tabBarInactiveTintColor: T.textTer,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <TabIcon Icon={ShoppingBag} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="(notifications)"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Bell} focused={focused} badge={unreadCount} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
