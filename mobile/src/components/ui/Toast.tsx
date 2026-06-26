import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Shadows } from '@/constants/colors';

const TYPE_COLORS = {
  success: T.success,
  error: T.danger,
  warning: T.warning,
  info: T.info,
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
          backgroundColor: T.surface,
          borderWidth: 1,
          borderColor: T.border,
          borderLeftWidth: 4,
          borderLeftColor: TYPE_COLORS[toast.type],
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          ...Shadows.md,
        }}
      >
        <Text style={{ fontFamily: Fonts.bodySemibold, color: T.text, fontSize: 14 }}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}
