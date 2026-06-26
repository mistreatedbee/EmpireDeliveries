import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { Input, Button } from '@/components/empire';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail, isValidSAPhone, normalizeSAPhone } from '@/utils/validators';
import { T, Fonts } from '@/constants/colors';
import { AppError } from '@/types/api.types';

function StepHeader({ current, total, title }: { current: number; total: number; title: string }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < current ? T.gold : T.border }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12 }}>
          {current}/{total}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 24 }}>{title}</Text>
    </View>
  );
}

export default function DriverStep1() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [fullName, setFullName] = useState(
    user ? `${(user as any).firstName ?? ''} ${(user as any).lastName ?? ''}`.trim() : '',
  );
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isLoggedIn = !!user;

  const registerMutation = useMutation({
    mutationFn: () => {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || firstName;
      return authService.register({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        phone: normalizeSAPhone(phone),
        password,
      });
    },
    onSuccess: () => {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? '';
      const lastName = nameParts.slice(1).join(' ') || firstName;
      router.push({
        pathname: '/(auth)/otp',
        params: {
          email: email.trim().toLowerCase(),
          phone: normalizeSAPhone(phone),
          purpose: 'registration',
          firstName,
          lastName,
          role: 'driver',
          nextRoute: '/(auth)/driver-signup/step-2',
          fullName: fullName.trim(),
          idNumber: idNumber.trim(),
        },
      });
    },
    onError: (error: AppError) => {
      if (error.message === 'User already exists') {
        showToast('An account with this email already exists. Please log in instead.', 'error');
        router.push('/(auth)/login');
      } else if (error.field) {
        setErrors((e) => ({ ...e, [error.field!]: error.message }));
      } else {
        showToast(error.message, 'error');
      }
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!idNumber.trim() || idNumber.replace(/\D/g, '').length !== 13)
      e.idNumber = 'Please enter a valid 13-digit SA ID number';
    if (!isLoggedIn) {
      if (!isValidEmail(email)) e.email = 'Please enter a valid email address';
      if (!isValidSAPhone(phone)) e.phone = 'Please enter a valid South African phone number';
      if (password.length < 8) e.password = 'Password must be at least 8 characters';
      if (password !== confirm) e.confirm = 'Passwords do not match';
    } else {
      if (!isValidSAPhone(phone)) e.phone = 'Please enter a valid South African phone number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (isLoggedIn) {
      router.push({
        pathname: '/(auth)/driver-signup/step-2',
        params: { fullName: fullName.trim(), idNumber: idNumber.trim(), phone: normalizeSAPhone(phone) },
      });
    } else {
      registerMutation.mutate();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepHeader current={1} total={4} title="Personal Details" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 24 }}>
          Tell us about yourself. Your info is kept secure.
        </Text>

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholder="e.g. John Doe"
          error={errors.fullName}
        />

        <Input
          label="SA ID Number"
          value={idNumber}
          onChangeText={setIdNumber}
          keyboardType="number-pad"
          placeholder="13-digit ID number"
          error={errors.idNumber}
        />

        <Input
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+27 8X XXX XXXX"
          error={errors.phone}
        />

        {!isLoggedIn && (
          <>
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="you@example.com"
              error={errors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Min. 8 characters"
              error={errors.password}
              rightIcon={
                <Text style={{ fontFamily: Fonts.bodySemibold, color: T.gold, fontSize: 13 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              }
              onRightIconPress={() => setShowPassword((p) => !p)}
            />

            <Input
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="Repeat password"
              error={errors.confirm}
            />
          </>
        )}

        <View style={{ marginTop: 8 }}>
          <Button onPress={handleNext} loading={registerMutation.isPending} size="lg">
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
