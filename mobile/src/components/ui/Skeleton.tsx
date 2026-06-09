import React, { useEffect, useRef } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

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

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.8] });

  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius, backgroundColor: '#E8E8E8', opacity }, style]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-3xl overflow-hidden mb-4 p-4" style={{ elevation: 2 }}>
      <Skeleton height={160} borderRadius={16} style={{ marginBottom: 12 }} />
      <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={12} style={{ marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Skeleton width={80} height={12} />
        <Skeleton width={80} height={12} />
      </View>
    </View>
  );
}
