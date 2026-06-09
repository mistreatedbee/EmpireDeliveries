import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ViewStyle } from 'react-native';

interface KeyboardWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function KeyboardWrapper({ children, style, contentStyle }: KeyboardWrapperProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1 }, style]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ flexGrow: 1 }, contentStyle]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
