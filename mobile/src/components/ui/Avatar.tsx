import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: '#0A0A0A', fontWeight: '700', fontSize: size * 0.38 }}>{initials}</Text>
    </View>
  );
}
