import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const SERVICES = [
  { emoji: '🍔', label: 'Food', category: 'fast-food', bg: '#FFF8E1' },
  { emoji: '🛒', label: 'Groceries', category: 'groceries', bg: '#E8F5E9' },
  { emoji: '💊', label: 'Pharmacy', category: 'pharmacy', bg: '#E3F2FD' },
  { emoji: '📦', label: 'Courier', category: 'courier', bg: '#F3E5F5' },
];

export function ServiceGrid() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, marginVertical: 8 }}>
      {SERVICES.map((s) => (
        <Pressable
          key={s.label}
          onPress={() => router.push({ pathname: '/(customer)/(home)/restaurant-list', params: { category: s.category } })}
          style={{ flex: 1, backgroundColor: s.bg, borderRadius: 16, padding: 12, alignItems: 'center', gap: 6 }}
        >
          <Text style={{ fontSize: 28 }}>{s.emoji}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.empire.black }}>{s.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
