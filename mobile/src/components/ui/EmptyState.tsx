import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon && <View className="mb-6">{icon}</View>}
      <Text className="text-empire-black font-bold text-xl text-center mb-2">{title}</Text>
      {subtitle && <Text className="text-surface-400 text-base text-center mb-6">{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button variant="gold" size="md" fullWidth={false} onPress={onAction}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
