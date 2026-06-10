import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/stores/orderStore';
import { T } from '@/constants/colors';

export default function PaymentSuccessScreen() {
  const { activeOrderId } = useOrderStore();
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    if (activeOrderId) {
      const t = setTimeout(() => {
        router.replace(`/(customer)/(orders)/tracking/${activeOrderId}`);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [scale, opacity, activeOrderId]);

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: T.successBg, alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <Check size={48} color={T.success} strokeWidth={2.5} />
          </View>
          <Text style={{ color: T.text, fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 10 }}>Order Placed!</Text>
          <Text style={{ color: T.textSec, fontSize: 16, textAlign: 'center', lineHeight: 24 }}>
            Your order has been received.{'\n'}We'll notify you once it's confirmed.
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
          <Button variant="secondary" size="lg" onPress={() => router.replace('/(customer)')}>
            Back to Home
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
