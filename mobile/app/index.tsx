import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';

export default function Index() {
  const { hydrate, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    async function bootstrap() {
      await hydrate();
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      const { user } = useAuthStore.getState();
      if (user?.role === 'driver') {
        router.replace('/(driver)');
      } else if (user?.role === 'restaurant') {
        router.replace('/(restaurant)');
      } else if (user?.role === 'admin') {
        router.replace('/(admin)');
      } else {
        router.replace('/(customer)' as any);
      }
    } else {
      AsyncStorage.getItem('empire_onboarded').then((seen) => {
        if (seen) {
          router.replace('/(auth)/login');
        } else {
          router.replace('/(auth)/splash');
        }
      });
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.gold[500]} />
    </View>
  );
}
