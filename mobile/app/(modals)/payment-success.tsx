import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated, Easing, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, ChefHat, CreditCard, Store } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/empire';
import { useOrderStore } from '@/stores/orderStore';
import { orderService } from '@/services/order.service';
import { Order } from '@/types/order.types';
import { statusSubtitle } from '@/utils/normalizeOrder';
import { T } from '@/constants/colors';
import { formatETA } from '@/utils/formatters';

type VerifyState = 'loading' | 'paid' | 'pending' | 'error';
type FlowStage = 'payment' | 'confirmed' | 'restaurant' | 'ready';

const FLOW_STEPS: { key: FlowStage; label: string; Icon: typeof CreditCard }[] = [
  { key: 'payment', label: 'Payment confirmed', Icon: CreditCard },
  { key: 'confirmed', label: 'Order placed', Icon: Check },
  { key: 'restaurant', label: 'Sent to restaurant', Icon: Store },
  { key: 'ready', label: 'Preparing your order', Icon: ChefHat },
];

function StepRow({
  label,
  Icon,
  active,
  done,
  pulse,
}: {
  label: string;
  Icon: typeof CreditCard;
  active: boolean;
  done: boolean;
  pulse: Animated.Value;
}) {
  const color = done ? T.success : active ? T.action : T.textTer;
  const bg = done ? T.successBg : active ? '#EEF4FF' : T.surface;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <Animated.View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: done || active ? 1.5 : 1,
          borderColor: done ? T.success : active ? T.action : T.border,
          transform: active ? [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] : undefined,
        }}
      >
        {done ? <Check size={20} color={T.success} strokeWidth={2.5} /> : <Icon size={18} color={color} />}
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: done || active ? '800' : '600', color: done || active ? T.text : T.textTer, fontSize: 15 }}>
          {label}
        </Text>
        {active && !done && (
          <Text style={{ color: T.textSec, fontSize: 12, marginTop: 2 }}>Just a moment…</Text>
        )}
      </View>
      {done && <Check size={16} color={T.success} />}
    </View>
  );
}

export default function PaymentSuccessScreen() {
  const { activeOrderId } = useOrderStore();
  const [verified, setVerified] = useState<VerifyState>('loading');
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>();
  const [order, setOrder] = useState<Order | null>(null);
  const [flowStage, setFlowStage] = useState<FlowStage>('payment');

  const heroScale = useRef(new Animated.Value(0.6)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  const stepPulse = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const etaMinutes = order?.estimatedDeliveryTime ?? 35;
  const isPaid = verified === 'paid';

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
          if (status.paymentStatus === 'paid' || status.paymentMethod === 'cash') {
            setVerified('paid');
            return;
          }
          if (i < 14) await new Promise((r) => setTimeout(r, 1500));
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
    if (verified !== 'paid' || !activeOrderId) return;

    let cancelled = false;
    void orderService.getById(activeOrderId).then((detail) => {
      if (!cancelled) setOrder(detail);
    });

    const stages: FlowStage[] = ['payment', 'confirmed', 'restaurant', 'ready'];
    let index = 0;
    setFlowStage(stages[index]);

    const timer = setInterval(() => {
      index += 1;
      if (index >= stages.length) {
        clearInterval(timer);
        return;
      }
      setFlowStage(stages[index]);
      if (stages[index] === 'ready') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 900);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [verified, activeOrderId]);

  useEffect(() => {
    if (verified === 'loading') return;

    Animated.parallel([
      Animated.spring(heroScale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 7 }),
      Animated.timing(heroOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(progressWidth, { toValue: 1, duration: 2400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();

    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 1.35, duration: 1200, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    ringLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(stepPulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(stepPulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulseLoop.start();

    return () => {
      ringLoop.stop();
      pulseLoop.stop();
    };
  }, [verified, heroOpacity, heroScale, progressWidth, ringOpacity, ringScale, stepPulse]);

  const stageIndex = useMemo(
    () => FLOW_STEPS.findIndex((step) => step.key === flowStage),
    [flowStage],
  );

  if (verified === 'loading') {
    return (
      <ScreenWrapper bg="white">
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <ActivityIndicator size="large" color={T.action} />
          <Text style={{ marginTop: 20, color: T.text, fontSize: 18, fontWeight: '800' }}>Confirming payment</Text>
          <Text style={{ marginTop: 8, color: T.textSec, textAlign: 'center', lineHeight: 22 }}>
            Securing your order and notifying the restaurant…
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}>
        <Animated.View style={{ alignItems: 'center', opacity: heroOpacity, transform: [{ scale: heroScale }] }}>
          <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Animated.View
              style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: isPaid ? T.success : '#FFF3E0',
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              }}
            />
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: isPaid ? T.successBg : '#FFF3E0',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: isPaid ? T.success : '#F57C00',
              }}
            >
              {isPaid ? (
                <Check size={48} color={T.success} strokeWidth={2.5} />
              ) : (
                <CreditCard size={40} color="#F57C00" />
              )}
            </View>
          </View>

          <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>
            {isPaid ? 'Order Confirmed!' : 'Order Received'}
          </Text>
          <Text style={{ color: T.textSec, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 20 }}>
            {isPaid
              ? paymentMethod === 'cash'
                ? 'Your order is in. Pay the driver on arrival.'
                : order?.restaurantName
                  ? `${order.restaurantName} is getting started on your order.`
                  : "Payment confirmed. We're sending your order to the restaurant."
              : verified === 'error'
                ? 'We could not verify payment yet. Check Orders for the latest status.'
                : 'Your order was created. Payment confirmation may take a moment.'}
          </Text>

          {isPaid && (
            <View
              style={{
                width: '100%',
                backgroundColor: T.surface,
                borderRadius: 16,
                padding: 18,
                borderWidth: 1,
                borderColor: T.border,
                marginBottom: 24,
              }}
            >
              <Text style={{ color: T.textTer, fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 6 }}>
                ESTIMATED ARRIVAL
              </Text>
              <Text style={{ color: T.text, fontSize: 32, fontWeight: '900' }}>{formatETA(etaMinutes)}</Text>
              <Text style={{ color: T.textSec, fontSize: 13, marginTop: 4 }}>
                {statusSubtitle(order?.status ?? 'placed')}
              </Text>
              <View style={{ height: 6, backgroundColor: T.border, borderRadius: 999, marginTop: 16, overflow: 'hidden' }}>
                <Animated.View
                  style={{
                    height: '100%',
                    backgroundColor: T.success,
                    borderRadius: 999,
                    width: progressWidth.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  }}
                />
              </View>
            </View>
          )}
        </Animated.View>

        {isPaid && (
          <View style={{ backgroundColor: T.bg, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, marginBottom: 24 }}>
            {FLOW_STEPS.map((step, index) => (
              <StepRow
                key={step.key}
                label={step.label}
                Icon={step.Icon}
                active={flowStage !== 'ready' && index === stageIndex}
                done={flowStage === 'ready' ? true : index < stageIndex}
                pulse={stepPulse}
              />
            ))}
          </View>
        )}

        <View style={{ marginTop: 'auto', gap: 12 }}>
          {activeOrderId && (
            <Button
              size="lg"
              fullWidth
              onPress={() => router.replace(`/(customer)/(orders)/tracking/${activeOrderId}`)}
            >
              Track Order & Edit Instructions
            </Button>
          )}
          <Button variant="secondary" size="lg" fullWidth onPress={() => router.replace('/(customer)' as any)}>
            Back to Home
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
