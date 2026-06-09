import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, error = false }: OtpInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) digits.push('');

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      const pasted = text.replace(/\D/g, '').slice(0, length);
      onChange(pasted);
      inputs.current[Math.min(pasted.length, length - 1)]?.focus();
      return;
    }
    const newDigits = [...digits];
    newDigits[index] = text.replace(/\D/g, '');
    onChange(newDigits.join(''));
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const borderColor = error ? '#D32F2F' : '#D4AF37';

  return (
    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
      {digits.map((digit, i) => (
        <Pressable key={i} onPress={() => inputs.current[i]?.focus()}>
          <TextInput
            ref={(ref) => { inputs.current[i] = ref; }}
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={{
              width: 46,
              height: 56,
              borderWidth: 2,
              borderColor: digit ? borderColor : '#E8E8E8',
              borderRadius: 12,
              textAlign: 'center',
              fontSize: 24,
              fontWeight: '700',
              color: '#0A0A0A',
              backgroundColor: '#FFFFFF',
            }}
          />
        </Pressable>
      ))}
    </View>
  );
}
