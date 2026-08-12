import '../global.css';
import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { queryClient } from '@/lib/queryClient';
import { injectAuthStore } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { notificationService } from '@/services/notification.service';
import Toast from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { Colors } from '@/constants/colors';

injectAuthStore(useAuthStore);

function AuthBootstrap() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    let cleanup = () => {};
    void import('@/lib/notifications').then(({ setupNotificationListeners, registerForPushNotifications }) => {
      cleanup = setupNotificationListeners();
      registerForPushNotifications()
        .then((token) => {
          if (token) notificationService.registerToken(token).catch(() => null);
        })
        .catch(() => null);
    });
    return () => cleanup();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthBootstrap />
          <ErrorBoundary>
            <Slot />
          </ErrorBoundary>
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
