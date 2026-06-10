import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const variantStyles: Record<Variant, { container: string; text: string; spinnerColor: string }> = {
  primary:     { container: 'bg-t-action',     text: 'text-white font-bold',     spinnerColor: '#FFFFFF' },
  secondary:   { container: 'bg-t-surface',    text: 'text-t-text font-bold',    spinnerColor: '#0A0A0A' },
  tertiary:    { container: 'bg-transparent',  text: 'text-t-action font-bold',  spinnerColor: '#0A0A0A' },
  destructive: { container: 'bg-t-danger',     text: 'text-white font-bold',     spinnerColor: '#FFFFFF' },
};

const sizeStyles: Record<Size, { container: string; text: string; height: number }> = {
  sm: { container: 'px-4 py-2',  text: 'text-sm',  height: 36 },
  md: { container: 'px-6 py-3',  text: 'text-base', height: 44 },
  lg: { container: 'px-8 py-4',  text: 'text-lg',  height: 52 },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  children,
  onPress,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const handlePress = (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    if (!isDisabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
          height: s.height,
          paddingHorizontal: size === 'lg' ? 32 : size === 'md' ? 24 : 16,
        },
        style,
      ]}
      className={`${v.container} ${isDisabled ? 'opacity-50' : ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.spinnerColor} />
      ) : (
        <Text className={`${v.text} ${s.text} text-center`}>{children}</Text>
      )}
    </Pressable>
  );
}
