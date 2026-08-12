import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Check, AlertCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/stores/orderStore';
import { orderService } from '@/services/order.service';
import { T } from '@/constants/colors';

export default function PaymentSuccessScreen() {
  const { activeOrderId } = useOrderStore();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [verified, setVerified] = useState<'loading' | 'paid' | 'pending' | 'error'>('loading');
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!activeOrderId) {
        setVerified('pending');
        return;
      }
      try {
        for (let i = 0; i < 15; i++) {
          const status = await orderService.getPaymentStatus(activeOrderId);
          if (cancelled) return;
          setPaymentMethod(status.paymentMethod);
          if (status.paymentStatus === 'paid') {
            setVerified('paid');
            return;
          }
          if (status.paymentMethod === 'cash' || status.paymentStatus === 'pending_cod') {
            setVerified('paid');
            return;
          }
          if (i < 14) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
        if (!cancelled) setVerified('pending');
      } catch {
        if (!cancelled) setVerified('error');
      }
    }
    verify();
    return () => { cancelled = true; };
  }, [activeOrderId]);

  useEffect(() => {
    if (verified === 'loading') return;
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    if (activeOrderId && verified === 'paid') {
      const t = setTimeout(() => {
        router.replace(`/(customer)/(orders)/tracking/${activeOrderId}`);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [scale, opacity, activeOrderId, verified]);

  if (verified === 'loading') {
    return (
      <ScreenWrapper bg="white">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={T.action} />
          <Text style={{ marginTop: 16, color: T.textSec }}>Confirming payment…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const isPaid = verified === 'paid';

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: isPaid ? T.successBg : '#FFF3E0',
            alignItems: 'center', justifyContent: 'center', marginBottom: 28,
          }}>
            {isPaid ? (
              <Check size={48} color={T.success} strokeWidth={2.5} />
            ) : (
              <AlertCircle size={48} color="#F57C00" strokeWidth={2.5} />
            )}
          </View>
          <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 10 }}>
            {isPaid ? 'Order Placed!' : 'Order Received'}
          </Text>
          <Text style={{ color: T.textSec, fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
            {isPaid
              ? paymentMethod === 'cash'
                ? "Your order has been placed.\nPay when your delivery arrives."
                : "Your payment was confirmed.\nWe'll notify you once the restaurant confirms."
              : verified === 'error'
                ? 'We could not verify payment yet.\nCheck your orders for the latest status.'
                : 'Your order was created.\nPayment confirmation may take a moment.'}
          </Text>
        </Animated.View>

        <View style={{ width: '100%', gap: 12 }}>
          {activeOrderId && (
            <Button
              size="lg"
              onPress={() => router.replace(`/(customer)/(orders)/tracking/${activeOrderId}`)}
            >
              Track My Order
            </Button>
          )}
          <Button variant="secondary" size="lg" onPress={() => router.replace('/(customer)' as any)}>
            Back to Home
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
