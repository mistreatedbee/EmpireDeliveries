import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';

type Variant = 'gold' | 'dark' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  gold: { container: 'bg-gold-500 rounded-2xl', text: 'text-empire-black font-bold' },
  dark: { container: 'bg-empire-black rounded-2xl', text: 'text-white font-bold' },
  outline: { container: 'border-2 border-empire-black rounded-2xl bg-transparent', text: 'text-empire-black font-bold' },
  ghost: { container: 'bg-transparent rounded-2xl', text: 'text-gold-600 font-bold' },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-4 py-2', text: 'text-sm' },
  md: { container: 'px-6 py-4', text: 'text-base' },
  lg: { container: 'px-8 py-5', text: 'text-lg' },
};

export function Button({
  variant = 'gold',
  size = 'md',
  loading = false,
  fullWidth = true,
  children,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const handlePress = (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    if (variant === 'gold') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${v.container} ${s.container} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'gold' ? '#0A0A0A' : '#D4AF37'} />
      ) : (
        <Text className={`${v.text} ${s.text} text-center`}>{children}</Text>
      )}
    </Pressable>
  );
}
