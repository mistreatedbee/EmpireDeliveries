import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/empire';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { authService } from '@/services/auth.service';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail } from '@/utils/validators';
import { T } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { showToast } = useUIStore();

  const mutation = useMutation({
    mutationFn: () => authService.forgotPassword({ email: email.trim().toLowerCase() }),
    onSuccess: () => {
      router.push({ pathname: '/(auth)/otp', params: { email: email.trim().toLowerCase(), purpose: 'password_reset' } } as any);
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  return (
    <ScreenWrapper bg="white">
      <KeyboardWrapper contentStyle={{ paddingHorizontal: 24, paddingTop: 60 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 40 }}>
          <Text style={{ color: T.action, fontSize: 16, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: T.border }}>
          <Mail size={26} color={T.text} />
        </View>
        <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Reset password</Text>
        <Text style={{ color: T.textSec, fontSize: 15, marginBottom: 32, lineHeight: 22 }}>
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
          size="lg"
          onPress={() => {
            if (!isValidEmail(email)) { setEmailError('Please enter a valid email address'); return; }
            setEmailError('');
            mutation.mutate();
          }}
          loading={mutation.isPending}
          fullWidth
          style={{ marginTop: 8 }}
        >
          Send Reset Link
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
