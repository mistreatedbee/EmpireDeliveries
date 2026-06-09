import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/ui/Button';
import { useOrderStore } from '@/stores/orderStore';
import { Colors } from '@/constants/colors';

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
  }, [scale, opacity]);

  return (
    <ScreenWrapper bg="black">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.gold[500], alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: Colors.gold[500], shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 12 }}>
            <Text style={{ fontSize: 60 }}>👑</Text>
          </View>
          <Text style={{ color: Colors.gold[500], fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>Order Placed!</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 17, textAlign: 'center', lineHeight: 26, opacity: 0.8 }}>
            Your order has been received.{'\n'}We'll notify you once it's confirmed.
          </Text>
        </Animated.View>

        <View style={{ width: '100%', gap: 12 }}>
          {activeOrderId && (
            <Button
              variant="gold"
              size="lg"
              onPress={() => router.replace(`/(customer)/(orders)/tracking/${activeOrderId}`)}
            >
              Track My Order
            </Button>
          )}
          <Button variant="outline" size="lg" onPress={() => router.replace('/(customer)')}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>Back to Home</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
