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
      style={[variantContainerStyle[variant], style]}
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

      {typeof children === 'string' ? (
        <Text
          className={textSizeClasses[size]}
          style={{ fontFamily: Fonts.bodySemibold, color: variantTextColor[variant] }}
        >
          {children}
        </Text>
      ) : (
        children
      )}

      {!loading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
}
