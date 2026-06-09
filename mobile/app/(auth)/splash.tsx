import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, Dimensions } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(progressWidth, { toValue: width - 80, duration: 1400, useNativeDriver: false }),
    ]).start(async () => {
      await AsyncStorage.setItem('empire_onboarded', 'false');
      router.replace('/(auth)/onboarding');
    });
  }, [logoScale, logoOpacity, titleOpacity, progressWidth]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.empire.black, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity, marginBottom: 24 }}>
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: Colors.gold[500],
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: Colors.gold[500],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <Text style={{ fontSize: 50, color: Colors.empire.black }}>👑</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: titleOpacity, alignItems: 'center', marginBottom: 60 }}>
        <Text style={{ color: Colors.gold[500], fontSize: 32, fontWeight: '900', letterSpacing: 1 }}>
          EMPIRE
        </Text>
        <Text style={{ color: Colors.empire.white, fontSize: 18, fontWeight: '300', letterSpacing: 6 }}>
          DELIVERIES
        </Text>
      </Animated.View>

      <View style={{ width: width - 80, height: 3, backgroundColor: Colors.empire.charcoal, borderRadius: 4, overflow: 'hidden' }}>
        <Animated.View
          style={{
            height: '100%',
            width: progressWidth,
            backgroundColor: Colors.gold[500],
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}
