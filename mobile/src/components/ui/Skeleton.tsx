import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';
import { T } from '@/constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius, backgroundColor: T.surface2, opacity }, style]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View
      style={{ backgroundColor: T.bg, borderRadius: 12, overflow: 'hidden', marginBottom: 12,
        borderWidth: 1, borderColor: T.border }}
    >
      <Skeleton height={140} borderRadius={0} style={{ marginBottom: 0 }} />
      <View style={{ padding: 12 }}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Skeleton width={70} height={12} />
          <Skeleton width={70} height={12} />
        </View>
      </View>
    </View>
  );
}
