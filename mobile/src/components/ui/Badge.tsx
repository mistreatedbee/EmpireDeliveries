import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

type BadgeVariant = 'gold' | 'dark' | 'success' | 'error' | 'danger' | 'warning' | 'outline';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  gold:    { bg: 'bg-t-goldBg',         text: 'text-t-gold' },
  dark:    { bg: 'bg-empire-black',     text: 'text-white' },
  success: { bg: 'bg-t-successBg',      text: 'text-t-success' },
  error:   { bg: 'bg-t-dangerBg',       text: 'text-t-danger' },
  danger:  { bg: 'bg-t-danger',         text: 'text-white' },
  warning: { bg: 'bg-t-warningBg',      text: 'text-t-warning' },
  outline: { bg: 'border border-t-border bg-transparent', text: 'text-t-text' },
};

export function Badge({ label, variant = 'dark', size = 'sm', style }: BadgeProps) {
  const v = variants[variant];
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <View className={`${v.bg} rounded-full ${padding} self-start`} style={style}>
      <Text className={`${v.text} ${textSize} font-medium`}>{label}</Text>
    </View>
  );
}
