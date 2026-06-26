import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { T, Fonts } from '@/constants/colors';

export type BadgeVariant =
  | 'gold'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyle: Record<BadgeVariant, { backgroundColor: string; borderWidth?: number; borderColor?: string }> = {
  gold: { backgroundColor: T.gold },
  neutral: { backgroundColor: T.surface2, borderWidth: 1, borderColor: T.border },
  success: { backgroundColor: T.successBg },
  warning: { backgroundColor: T.warningBg },
  danger: { backgroundColor: T.dangerBg },
  info: { backgroundColor: T.infoBg },
};

const variantTextColor: Record<BadgeVariant, string> = {
  gold: T.goldForeground,
  neutral: T.textSec,
  success: T.success,
  warning: T.warning,
  danger: T.danger,
  info: T.info,
};

export function Badge({
  variant = 'neutral',
  leftIcon,
  className,
  style,
  children,
  ...props
}: BadgeProps) {
  return (
    <View
      className={['flex-row items-center gap-1 rounded-full px-2.5 py-0.5', className ?? '']
        .filter(Boolean)
        .join(' ')}
      style={[variantStyle[variant], style]}
      {...props}
    >
      {leftIcon && <View className="mr-0.5">{leftIcon}</View>}
      <Text
        className="text-xs"
        style={{ fontFamily: Fonts.bodySemibold, color: variantTextColor[variant] }}
      >
        {children}
      </Text>
    </View>
  );
}
