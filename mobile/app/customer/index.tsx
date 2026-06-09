import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Customer() {
  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Customer App</Text>
      <Link href="/customer/home" style={{ marginBottom: 10 }}>Open Home</Link>
      <Link href="/customer/profile">Open Profile</Link>
    </View>
  );
}
