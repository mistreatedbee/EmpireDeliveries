import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { userService } from '@/services/user.service';
import { useUIStore } from '@/stores/uiStore';
import { T } from '@/constants/colors';

export default function ChangePasswordScreen() {
  const { showToast } = useUIStore();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError('');
  };

  const mutation = useMutation({
    mutationFn: () => userService.changePassword(form.current, form.next),
    onSuccess: () => {
      showToast('Password changed successfully', 'success');
      router.back();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to change password';
      setError(msg);
      showToast(msg, 'error');
    },
  });

  const handleSubmit = () => {
    if (!form.current || !form.next || !form.confirm) {
      setError('All fields are required');
      return;
    }
    if (form.next.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }
    if (form.next !== form.confirm) {
      setError('New passwords do not match');
      return;
    }
    mutation.mutate();
  };

  return (
    <ScreenWrapper bg="white">
      <Header title="Change Password" />
      <KeyboardWrapper contentStyle={{ padding: 20 }}>
        <Input
          label="Current Password"
          value={form.current}
          onChangeText={set('current')}
          secureTextEntry={!showCurrent}
          autoCapitalize="none"
          leftIcon={<Lock size={16} color={T.textTer} />}
          rightIcon={showCurrent ? <EyeOff size={16} color={T.textTer} /> : <Eye size={16} color={T.textTer} />}
          onRightIconPress={() => setShowCurrent((v) => !v)}
        />
        <Input
          label="New Password"
          value={form.next}
          onChangeText={set('next')}
          secureTextEntry={!showNext}
          autoCapitalize="none"
          leftIcon={<Lock size={16} color={T.textTer} />}
          rightIcon={showNext ? <EyeOff size={16} color={T.textTer} /> : <Eye size={16} color={T.textTer} />}
          onRightIconPress={() => setShowNext((v) => !v)}
        />
        <Input
          label="Confirm New Password"
          value={form.confirm}
          onChangeText={set('confirm')}
          secureTextEntry
          autoCapitalize="none"
          leftIcon={<Lock size={16} color={T.textTer} />}
        />
        {error ? (
          <Text style={{ color: T.danger, fontSize: 13, marginBottom: 12, marginTop: -8 }}>{error}</Text>
        ) : null}
        <Button
          size="lg"
          onPress={handleSubmit}
          loading={mutation.isPending}
          style={{ marginTop: 8 }}
        >
          Change Password
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
