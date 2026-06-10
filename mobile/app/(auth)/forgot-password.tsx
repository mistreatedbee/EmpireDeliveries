import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { authService } from '@/services/auth.service';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail } from '@/utils/validators';
import { T } from '@/constants/colors';
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
      <ScreenWrapper bg="white">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: T.successBg, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Mail size={32} color={T.success} />
          </View>
          <Text style={{ color: T.text, fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 10 }}>Check your email</Text>
          <Text style={{ color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 40 }}>
            We've sent a password reset link to{'\n'}
            <Text style={{ color: T.text, fontWeight: '700' }}>{email}</Text>
          </Text>
          <Button size="lg" onPress={() => router.replace('/(auth)/login')}>Back to Login</Button>
        </View>
      </ScreenWrapper>
    );
  }

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
          style={{ marginTop: 8 }}
        >
          Send Reset Link
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
