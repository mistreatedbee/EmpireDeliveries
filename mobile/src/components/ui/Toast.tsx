import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';

const TYPE_COLORS = {
  success: Colors.empire.success,
  error: Colors.empire.error,
  warning: Colors.empire.warning,
  info: Colors.gold[500],
};

export default function Toast() {
  const { toast } = useUIStore();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [toast, translateY, opacity]);

  if (!toast) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        transform: [{ translateY }],
        opacity,
        zIndex: 9999,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.empire.charcoal,
          borderLeftWidth: 4,
          borderLeftColor: TYPE_COLORS[toast.type],
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}
