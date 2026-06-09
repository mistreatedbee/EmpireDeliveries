import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'border-empire-error'
    : focused
    ? 'border-gold-500'
    : 'border-surface-300';

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-empire-black font-medium text-sm mb-1.5">{label}</Text>
      )}
      <View className={`flex-row items-center border-2 ${borderColor} rounded-2xl bg-white px-4 py-3`}>
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-empire-black text-base"
          placeholderTextColor="#D0D0D0"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[{ fontFamily: 'Inter_400Regular' }, style as object]}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} className="ml-3">
            {rightIcon}
          </Pressable>
        )}
      </View>
      {error && <Text className="text-empire-error text-xs mt-1 ml-1">{error}</Text>}
      {hint && !error && <Text className="text-surface-400 text-xs mt-1 ml-1">{hint}</Text>}
    </View>
  );
}
