import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { authService } from '@/services/auth.service';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const { showToast } = useUIStore();

  const mutation = useMutation({
    mutationFn: () => authService.resetPassword({ token: token ?? '', newPassword: password }),
    onSuccess: () => {
      showToast('Password reset successfully', 'success');
      router.replace('/(auth)/login');
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  const validate = () => {
    const e: typeof errors = {};
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <ScreenWrapper bg="black">
      <KeyboardWrapper contentStyle={{ paddingHorizontal: 24, paddingTop: 80 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>New password</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 36 }}>Choose a strong password.</Text>

        <Input label="New password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Min. 8 characters" error={errors.password} />
        <Input label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" error={errors.confirm} />

        <Button variant="gold" size="lg" onPress={() => validate() && mutation.mutate()} loading={mutation.isPending} style={{ marginTop: 8 }}>
          Reset Password
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
