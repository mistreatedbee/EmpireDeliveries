import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { authService } from '@/services/auth.service';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail } from '@/utils/validators';
import { Colors } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sent, setSent] = useState(false);
  const { showToast } = useUIStore();

  const mutation = useMutation({
    mutationFn: () => authService.forgotPassword({ email: email.trim().toLowerCase() }),
    onSuccess: () => setSent(true),
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  if (sent) {
    return (
      <ScreenWrapper bg="black">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Text style={{ fontSize: 64, marginBottom: 24 }}>📧</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 12 }}>Check your email</Text>
          <Text style={{ color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 40 }}>
            We've sent a password reset link to{'\n'}
            <Text style={{ color: Colors.gold[500], fontWeight: '700' }}>{email}</Text>
          </Text>
          <Button variant="gold" size="lg" onPress={() => router.replace('/(auth)/login')}>Back to Login</Button>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="black">
      <KeyboardWrapper contentStyle={{ paddingHorizontal: 24, paddingTop: 60 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 40 }}>
          <Text style={{ color: Colors.gold[500], fontSize: 16 }}>← Back</Text>
        </Pressable>

        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔑</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Reset password</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 36, lineHeight: 22 }}>
          Enter your email and we'll send you a reset link.
        </Text>

        <Input
          label="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          error={emailError}
        />

        <Button
          variant="gold"
          size="lg"
          onPress={() => {
            if (!isValidEmail(email)) { setEmailError('Please enter a valid email address'); return; }
            setEmailError('');
            mutation.mutate();
          }}
          loading={mutation.isPending}
          style={{ marginTop: 8 }}
        >
          Send Reset Link
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
