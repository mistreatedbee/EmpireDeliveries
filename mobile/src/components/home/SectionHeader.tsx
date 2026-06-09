import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '900', color: '#0A0A0A' }}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={{ fontSize: 14, color: '#D4AF37', fontWeight: '600' }}>See All</Text>
        </Pressable>
      )}
    </View>
  );
}
