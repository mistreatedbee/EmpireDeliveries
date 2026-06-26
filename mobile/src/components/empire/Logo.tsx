import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, Fonts, Shadows } from '@/constants/colors';

export type LogoVariant = 'full' | 'mark';

export interface LogoProps {
  variant?: LogoVariant;
  size?: number;
  /** When true (default), text uses the light-theme dark foreground. Set false for use on a black/dark background. */
  onDark?: boolean;
  className?: string;
}

function CrownMark({ size }: { size: number }) {
  const innerSize = size * 0.62;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: T.gold,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.glow,
      }}
      accessibilityElementsHidden
    >
      <Svg
        viewBox="0 0 24 24"
        width={innerSize}
        height={innerSize}
        fill="none"
      >
        <Path
          d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 9.5h-15L3 8z"
          fill={T.goldForeground}
        />
        <Rect x="4.5" y="18.5" width="15" height="1.8" rx="0.9" fill={T.goldForeground} />
      </Svg>
    </View>
  );
}

export function Logo({
  variant = 'full',
  size = 36,
  onDark = true,
  className,
}: LogoProps) {
  if (variant === 'mark') {
    return (
      <View
        accessibilityLabel="Empire Deliveries"
        accessibilityRole="image"
      >
        <CrownMark size={size} />
      </View>
    );
  }

  const fontSize = size * 0.5;
  const textColor = onDark ? T.text : T.textOnDark;

  return (
    <View
      className={['flex-row items-center', className ?? ''].filter(Boolean).join(' ')}
      style={{ gap: 10 }}
      accessibilityLabel="Empire Deliveries"
      accessibilityRole="image"
    >
      <CrownMark size={size} />
      <Text
        style={{
          fontFamily: Fonts.headingExtra,
          fontSize,
          lineHeight: fontSize * 1.1,
          letterSpacing: -0.5,
        }}
      >
        <Text style={{ color: textColor }}>Empire</Text>
        <Text style={{ color: T.gold }}> Deliveries</Text>
      </Text>
    </View>
  );
}
