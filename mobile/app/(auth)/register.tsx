import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail, isValidSAPhone, normalizeSAPhone } from '@/utils/validators';
import { Colors } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function RegisterScreen() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const { showToast } = useUIStore();

  const registerMutation = useMutation({
    mutationFn: () =>
      authService.register({
        ...form,
        email: form.email.trim().toLowerCase(),
        phone: normalizeSAPhone(form.phone),
      }),
    onSuccess: () => {
      router.push({ pathname: '/(auth)/otp', params: { phone: normalizeSAPhone(form.phone), purpose: 'registration' } });
    },
    onError: (error: AppError) => {
      if (error.field) setErrors((e) => ({ ...e, [error.field!]: error.message }));
      else showToast(error.message, 'error');
    },
  });

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!isValidEmail(form.email)) e.email = 'Please enter a valid email address';
    if (!isValidSAPhone(form.phone)) e.phone = 'Please enter a valid South African phone number';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <ScreenWrapper bg="black">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 24 }}>
          <Text style={{ color: Colors.gold[500], fontSize: 16 }}>← Back</Text>
        </Pressable>

        <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Create account</Text>
        <Text style={{ color: '#888', fontSize: 15, marginBottom: 36 }}>Join Empire Deliveries today</Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input label="First name" value={form.firstName} onChangeText={set('firstName')} placeholder="John" error={errors.firstName} autoCapitalize="words" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="Last name" value={form.lastName} onChangeText={set('lastName')} placeholder="Doe" error={errors.lastName} autoCapitalize="words" />
          </View>
        </View>

        <Input label="Email address" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={errors.email} />

        <Input label="Phone number" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+27 82 000 0000" error={errors.phone} hint="South African number required" />

        <Input
          label="Password"
          value={form.password}
          onChangeText={set('password')}
          secureTextEntry={!showPassword}
          placeholder="Min. 8 characters"
          error={errors.password}
          rightIcon={<Text style={{ color: Colors.gold[500], fontWeight: '600', fontSize: 13 }}>{showPassword ? 'Hide' : 'Show'}</Text>}
          onRightIconPress={() => setShowPassword((p) => !p)}
        />

        <Button variant="gold" size="lg" onPress={() => validate() && registerMutation.mutate()} loading={registerMutation.isPending} style={{ marginTop: 8 }}>
          Create Account
        </Button>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ color: '#888', fontSize: 15 }}>Already have an account? </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 15 }}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
