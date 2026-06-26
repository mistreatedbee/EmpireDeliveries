import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { Button, Input } from '@/components/empire';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import api from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { User } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: () => api.put<never, ApiResponse<User>>('/users/profile', form),
    onSuccess: (res) => {
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
      showToast('Profile updated', 'success');
      router.back();
    },
    onError: () => showToast('Failed to update profile', 'error'),
  });

  return (
    <ScreenWrapper bg="surface">
      <Header title="Edit Profile" />
      <KeyboardWrapper contentStyle={{ padding: 20 }}>
        <Input label="First Name" value={form.firstName} onChangeText={set('firstName')} autoCapitalize="words" />
        <Input label="Last Name" value={form.lastName} onChangeText={set('lastName')} autoCapitalize="words" />
        <Input label="Phone Number" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
        <Input label="Email" value={user?.email ?? ''} editable={false} helperText="Email cannot be changed" />
        <Button variant="primary" size="lg" fullWidth onPress={() => mutation.mutate()} loading={mutation.isPending} style={{ marginTop: 8 }}>
          Save Changes
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
