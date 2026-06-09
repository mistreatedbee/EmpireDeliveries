import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Admin() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Admin Console (placeholder)</Text>
      <Text>Admin panels should be implemented here.</Text>
      <Link href="/">Back</Link>
    </View>
  );
}
