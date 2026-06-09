import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Driver() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Driver App (placeholder)</Text>
      <Text>Driver login and dashboard should be implemented here by converting existing web components.</Text>
      <Link href="/">Back</Link>
    </View>
  );
}
