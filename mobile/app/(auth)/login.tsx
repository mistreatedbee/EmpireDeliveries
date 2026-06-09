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
import { Colors } from '@/constants/colors';
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
    <ScreenWrapper bg="black">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 48 }}>
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 36 }}>👑</Text>
            </View>
            <Text style={{ color: Colors.gold[500], fontSize: 26, fontWeight: '900' }}>EMPIRE</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 13, letterSpacing: 5, fontWeight: '300' }}>DELIVERIES</Text>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>Welcome back</Text>
          <Text style={{ color: '#888', fontSize: 15, marginBottom: 36 }}>Sign in to your account</Text>

          <Input
            label="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
            style={{ color: '#0A0A0A' }}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            error={errors.password}
            rightIcon={
              <Text style={{ color: Colors.gold[500], fontWeight: '600', fontSize: 13 }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            }
            onRightIconPress={() => setShowPassword((p) => !p)}
          />

          <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end', marginBottom: 28, marginTop: -8 }}>
            <Text style={{ color: Colors.gold[500], fontWeight: '600', fontSize: 14 }}>Forgot password?</Text>
          </Pressable>

          <Button variant="gold" size="lg" onPress={handleLogin} loading={loginMutation.isPending}>
            Sign In
          </Button>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 28 }}>
            <Text style={{ color: '#888', fontSize: 15 }}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 15 }}>Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
