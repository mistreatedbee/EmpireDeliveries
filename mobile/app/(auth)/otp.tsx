import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button, OtpInput } from '@/components/empire';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { T } from '@/constants/colors';
import { AppError } from '@/types/api.types';

export default function OtpScreen() {
  const allParams = useLocalSearchParams<Record<string, string>>();
  const { email, purpose, nextRoute, firstName, lastName, phone, role } =
    allParams as {
      email: string;
      purpose: 'registration' | 'password_reset';
      nextRoute?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: string;
    };

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
    mutationFn: async () => {
      if (purpose === 'password_reset') {
        // Exchange the 6-digit code for an InsForge reset token
        return authService.exchangeResetCode({ email, code: otp });
      }
      // Registration: verify email OTP + sync user to our DB
      return authService.verifyOtp({ email, otp, purpose, firstName, lastName, phone, role });
    },
    onSuccess: async (result: any) => {
      if (purpose === 'password_reset') {
        router.replace({ pathname: '/(auth)/reset-password', params: { token: result.token } } as any);
        return;
      }
      const { user, tokens } = result;
      await setAuth(user, tokens.accessToken, tokens.refreshToken);
      const { otp: _otp, nextRoute: _nr, purpose: _purpose, ...forwardParams } = allParams;
      router.replace({
        pathname: (nextRoute as any) ?? '/(auth)/location-setup',
        params: forwardParams,
      } as any);
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.resendOtp({ email }),
    onSuccess: () => {
      setCountdown(60);
      showToast('Verification code resent', 'success');
    },
    onError: (error: AppError) => showToast(error.message, 'error'),
  });

  const handleVerify = useCallback(() => {
    if (otp.length === 6 && !verifyMutation.isPending) verifyMutation.mutate();
  }, [otp, verifyMutation.isPending, verifyMutation.mutate]);

  // Auto-submit once a 6-digit code is entered. Deliberately depends only on
  // `otp` — `verifyMutation`/`handleVerify` get a new identity on every status
  // change, and including them here caused mutate() to re-fire in a loop on
  // every pending/error transition until InsForge's per-IP rate limit tripped.
  useEffect(() => {
    if (otp.length === 6) handleVerify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' }}>
        <Pressable onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 40 }}>
          <Text style={{ color: T.action, fontSize: 16, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: T.border }}>
            <Mail size={32} color={T.text} />
          </View>
          <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 10 }}>
            {purpose === 'password_reset' ? 'Reset your password' : 'Verify your email'}
          </Text>
          <Text style={{ color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            We sent a 6-digit code to{'\n'}
            <Text style={{ color: T.text, fontWeight: '700' }}>{email}</Text>
          </Text>
        </View>

        <OtpInput length={6} value={otp} onChange={setOtp} error={verifyMutation.isError} />

        <View style={{ marginTop: 48, width: '100%' }}>
          <Button variant="primary" size="lg" fullWidth onPress={handleVerify} loading={verifyMutation.isPending} disabled={otp.length < 6}>
            {purpose === 'password_reset' ? 'Continue' : 'Verify'}
          </Button>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: T.textSec, fontSize: 14 }}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={{ color: T.textTer, fontSize: 14 }}>Resend in {countdown}s</Text>
          ) : (
            <Pressable onPress={() => resendMutation.mutate()} disabled={resendMutation.isPending}>
              <Text style={{ color: T.action, fontWeight: '700', fontSize: 14 }}>Resend code</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
