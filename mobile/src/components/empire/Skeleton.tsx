import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewProps, ViewStyle } from 'react-native';
import { T } from '@/constants/colors';

export interface SkeletonProps extends ViewProps {
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  width?: number | string;
  height?: number | string;
}

const roundedStyles: Record<string, number> = {
  sm: 10,
  md: 16,
  lg: 24,
  full: 999,
};

export function Skeleton({
  rounded = 'md',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  const baseStyle: ViewStyle = {
    backgroundColor: T.surface2,
    borderRadius: roundedStyles[rounded],
    ...(width !== undefined ? { width: width as number } : {}),
    ...(height !== undefined ? { height: height as number } : {}),
  };

  return (
    <Animated.View
      style={[baseStyle, { opacity }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="w-full overflow-hidden rounded-2xl border border-t-border bg-t-surface">
      <Skeleton rounded="sm" height={128} width="100%" style={{ borderRadius: 0 }} />
      <View className="p-5 gap-3">
        <Skeleton height={16} width="66%" />
        <Skeleton height={12} width="50%" />
        <Skeleton rounded="full" height={36} width="100%" />
      </View>
    </View>
  );
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <View className="w-full gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row items-center gap-3">
          <Skeleton rounded="full" height={44} width={44} />
          <View className="flex-1 gap-2">
            <Skeleton height={12} width="33%" />
            <Skeleton height={12} width="50%" />
          </View>
        </View>
      ))}
    </View>
  );
}
