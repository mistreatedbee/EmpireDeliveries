import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, OtpInput } from '@/components/ui';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function OtpScreen() {
  const { phone, purpose } = useLocalSearchParams<{ phone: string; purpose: 'registration' | 'password_reset' }>();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const { setAuth } = useAuthStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const verifyMutation = useMutation({
    mutationFn: () => authService.verifyOtp({ phone, otp, purpose }),
    onSuccess: async ({ user, tokens }) => {
      if (purpose === 'registration') {
        await setAuth(user, tokens.accessToken, tokens.refreshToken);
        router.replace('/(auth)/location-setup');
      } else {
        router.replace('/(auth)/reset-password');
      }
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.resendOtp({ phone }),
    onSuccess: () => {
      setCountdown(60);
      showToast('OTP sent again', 'success');
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  const handleVerify = useCallback(() => {
    if (otp.length === 6) verifyMutation.mutate();
  }, [otp, verifyMutation]);

  useEffect(() => {
    if (otp.length === 6) handleVerify();
  }, [otp, handleVerify]);

  return (
    <ScreenWrapper bg="black">
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' }}>
        <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 40 }}>
          <Text style={{ color: Colors.gold[500], fontSize: 16 }}>← Back</Text>
        </Pressable>

        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📱</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 12 }}>
            Verify your number
          </Text>
          <Text style={{ color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ color: Colors.gold[500], fontWeight: '700' }}>{phone}</Text>
          </Text>
        </View>

        <OtpInput length={6} value={otp} onChange={setOtp} error={verifyMutation.isError} />

        <View style={{ marginTop: 48, width: '100%' }}>
          <Button variant="gold" size="lg" onPress={handleVerify} loading={verifyMutation.isPending} disabled={otp.length < 6}>
            Verify
          </Button>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: '#888', fontSize: 14 }}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={{ color: '#555', fontSize: 14 }}>Resend in {countdown}s</Text>
          ) : (
            <Pressable onPress={() => resendMutation.mutate()} disabled={resendMutation.isPending}>
              <Text style={{ color: Colors.gold[500], fontWeight: '700', fontSize: 14 }}>Resend OTP</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
