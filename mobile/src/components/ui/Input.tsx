import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  dark?: boolean;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  dark = false,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  if (dark) {
    const borderColor = error ? '#ef4444' : focused ? '#D4AF37' : '#333';
    return (
      <View style={{ marginBottom: 16 }}>
        {label && (
          <Text style={{ color: '#aaa', fontSize: 12, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 }}>{label}</Text>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor, borderRadius: 12, backgroundColor: '#1a1a1a', paddingHorizontal: 14, paddingVertical: 12 }}>
          {leftIcon && <View style={{ marginRight: 10 }}>{leftIcon}</View>}
          <TextInput
            style={[{ flex: 1, color: '#fff', fontSize: 15, fontFamily: 'Inter_400Regular' }, style as object]}
            placeholderTextColor="#555"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {rightIcon && (
            <Pressable onPress={onRightIconPress} style={{ marginLeft: 10 }}>
              {rightIcon}
            </Pressable>
          )}
        </View>
        {error && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4, marginLeft: 2 }}>{error}</Text>}
        {hint && !error && <Text style={{ color: '#666', fontSize: 12, marginTop: 4, marginLeft: 2 }}>{hint}</Text>}
      </View>
    );
  }

  const borderColor = error
    ? 'border-t-danger'
    : focused
    ? 'border-t-action'
    : 'border-t-border';

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
