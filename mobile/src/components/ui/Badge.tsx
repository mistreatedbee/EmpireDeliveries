import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

type BadgeVariant = 'gold' | 'dark' | 'success' | 'error' | 'warning' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  gold: { bg: 'bg-gold-500', text: 'text-empire-black' },
  dark: { bg: 'bg-empire-black', text: 'text-white' },
  success: { bg: 'bg-empire-success', text: 'text-white' },
  error: { bg: 'bg-empire-error', text: 'text-white' },
  warning: { bg: 'bg-empire-warning', text: 'text-empire-black' },
  outline: { bg: 'border border-empire-black bg-transparent', text: 'text-empire-black' },
};

export function Badge({ label, variant = 'gold', size = 'sm', style }: BadgeProps) {
  const v = variants[variant];
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <View className={`${v.bg} rounded-full ${padding} self-start`} style={style}>
      <Text className={`${v.text} ${textSize} font-medium`}>{label}</Text>
    </View>
  );
}
