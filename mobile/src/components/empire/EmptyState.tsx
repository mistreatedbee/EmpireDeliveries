import React from 'react';
import { View, Text } from 'react-native';
import { Fonts } from '@/constants/colors';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <View
      className={[
        'flex-1 items-center justify-center px-6 py-12',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-t-surface2">
          {icon}
        </View>
      )}

      <Text
        className="text-lg text-t-text text-center"
        style={{ fontFamily: Fonts.heading }}
      >
        {title}
      </Text>

      {description && (
        <Text
          className="mt-1.5 text-sm text-t-textSec text-center max-w-xs"
          style={{ fontFamily: 'Inter_400Regular' }}
        >
          {description}
        </Text>
      )}

      {action && <View className="mt-5">{action}</View>}
    </View>
  );
}
