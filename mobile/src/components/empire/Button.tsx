import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { T, Fonts, Shadows } from '@/constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

const variantContainerStyle: Record<ButtonVariant, object> = {
  primary: { backgroundColor: T.gold, ...Shadows.glow },
  secondary: { backgroundColor: T.glass, borderWidth: 1, borderColor: T.glassBorder },
  ghost: { backgroundColor: 'transparent' },
  destructive: { backgroundColor: T.danger },
};

const variantTextColor: Record<ButtonVariant, string> = {
  primary: T.goldForeground,
  secondary: T.text,
  ghost: T.text,
  destructive: '#FFFFFF',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 gap-1.5',
  md: 'h-11 px-5 gap-2',
  lg: 'h-12 px-6 gap-2',
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

const sizeHeights: Record<ButtonSize, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

function flattenToLabel(children: React.ReactNode): string | null {
  if (children == null || typeof children === 'boolean') return null;
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    const parts = children
      .map((child) => flattenToLabel(child))
      .filter((part): part is string => part != null && part.length > 0);
    return parts.length > 0 ? parts.join('') : null;
  }
  return null;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  onPress,
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const label = flattenToLabel(children);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={[
        'flex-row items-center justify-center rounded-full',
        sizeClasses[size],
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={[
        variantContainerStyle[variant],
        { minHeight: sizeHeights[size], width: fullWidth ? '100%' : undefined },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? T.goldForeground : variant === 'destructive' ? '#fff' : T.gold}
        />
      ) : (
        leftIcon && <View className="mr-2">{leftIcon}</View>
      )}

      {label != null ? (
        <Text
          className={textSizeClasses[size]}
          style={{ fontFamily: Fonts.bodySemibold, color: variantTextColor[variant] }}
        >
          {label}
        </Text>
      ) : (
        children
      )}

      {!loading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
}
