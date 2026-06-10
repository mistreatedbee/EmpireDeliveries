import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, Input } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { isValidEmail } from '@/utils/validators';
import { registerForPushNotifications } from '@/lib/notifications';
import { notificationService } from '@/services/notification.service';
import { T } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { setAuth } = useAuthStore();
  const { showToast } = useUIStore();

  const loginMutation = useMutation({
    mutationFn: () => authService.login({ email: email.trim().toLowerCase(), password }),
    onSuccess: async ({ user, tokens }) => {
      await setAuth(user, tokens.accessToken, tokens.refreshToken);
      const pushToken = await registerForPushNotifications();
      if (pushToken) await notificationService.registerToken(pushToken);
      router.replace(user.role === 'driver' ? '/(driver)' : '/(customer)');
    },
    onError: (error: AppError) => {
      if (error.field === 'email') setErrors({ email: error.message });
      else if (error.field === 'password') setErrors({ password: error.message });
      else showToast(error.message, 'error');
    },
  });

  const validate = () => {
    const e: typeof errors = {};
    if (!isValidEmail(email)) e.email = 'Please enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (validate()) loginMutation.mutate();
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 48 }}>
          {/* Wordmark */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ fontSize: 26, fontWeight: '900', color: T.text, letterSpacing: -0.5 }}>Empire Deliveries</Text>
            <Text style={{ fontSize: 12, color: T.textTer, letterSpacing: 3, marginTop: 2, textTransform: 'uppercase' }}>Order. Track. Enjoy.</Text>
          </View>

          <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', marginBottom: 6 }}>Welcome back</Text>
          <Text style={{ color: T.textSec, fontSize: 15, marginBottom: 32 }}>Sign in to your account</Text>

          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            error={errors.password}
            rightIcon={
              <Text style={{ color: T.action, fontWeight: '600', fontSize: 13 }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            }
            onRightIconPress={() => setShowPassword((p) => !p)}
          />

          <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 28, marginTop: -8 }}>
            <Text style={{ color: T.action, fontWeight: '600', fontSize: 14 }}>Forgot password?</Text>
          </Pressable>

          <Button size="lg" onPress={handleLogin} loading={loginMutation.isPending}>
            Sign In
          </Button>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 28 }}>
            <Text style={{ color: T.textSec, fontSize: 15 }}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={{ color: T.action, fontWeight: '700', fontSize: 15 }}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
