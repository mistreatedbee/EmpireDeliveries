import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface QueryErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function QueryErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: QueryErrorStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: T.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <AlertCircle size={28} color={T.danger} />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: T.text,
          textAlign: 'center',
          fontFamily: Fonts.heading,
        }}
      >
        Unable to load
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 14,
          color: T.textSec,
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 20,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{
            marginTop: 20,
            backgroundColor: T.action,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}
