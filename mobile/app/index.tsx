import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { resolvePostAuthRoute } from '@/utils/authRouting';
import { Colors } from '@/constants/colors';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuthStore();

  // Do NOT call hydrate() here — AuthBootstrap (app/_layout.tsx) already
  // calls it once, from a sibling mounted in the same initial commit. Calling
  // it again here raced that call: two concurrent hydrate() invocations both
  // read SecureStore/AsyncStorage independently and both call set() on the
  // store, so whichever resolves last silently overwrites the other — if
  // that one read a stale/inconsistent snapshot, isAuthenticated could land
  // on false and this screen would route straight to login. Just wait for
  // isLoading to flip false (driven solely by AuthBootstrap's single call).

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      const { user } = useAuthStore.getState();
      router.replace(resolvePostAuthRoute(user ?? { role: 'customer' } as any) as any);
      return;
    }
    AsyncStorage.getItem('empire_onboarded').then((seen) => {
      if (seen) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(auth)/splash');
      }
    });
  }, [isLoading, isAuthenticated]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.gold[500]} />
    </View>
  );
}
