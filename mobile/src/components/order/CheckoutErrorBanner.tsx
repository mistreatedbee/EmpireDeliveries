import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { T } from '@/constants/colors';

interface CheckoutErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function CheckoutErrorBanner({ message, onDismiss }: CheckoutErrorBannerProps) {
  if (!message) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: T.danger + '12',
        borderWidth: 1,
        borderColor: T.danger + '40',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
      }}
    >
      <AlertCircle size={18} color={T.danger} style={{ marginTop: 1 }} />
      <Text style={{ flex: 1, color: T.danger, fontSize: 14, lineHeight: 20 }}>{message}</Text>
      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Text style={{ color: T.danger, fontWeight: '700', fontSize: 13 }}>Dismiss</Text>
        </Pressable>
      )}
    </View>
  );
}
