import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace('/customer/onboarding'), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Empire Deliveries</Text>
    </View>
  );
}

// This screen is superseded by app/(auth)/splash.tsx
