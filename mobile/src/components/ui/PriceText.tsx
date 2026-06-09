import React from 'react';
import { Text, TextStyle } from 'react-native';

interface PriceTextProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: TextStyle;
  strikethrough?: boolean;
}

const sizeMap = { sm: 12, md: 16, lg: 20, xl: 28 };

export function PriceText({ amount, size = 'md', color = '#0A0A0A', style, strikethrough = false }: PriceTextProps) {
  const formatted = `R${amount.toFixed(2)}`;
  return (
    <Text style={[{ fontSize: sizeMap[size], fontWeight: '700', color, textDecorationLine: strikethrough ? 'line-through' : 'none' }, style]}>
      {formatted}
    </Text>
  );
}
