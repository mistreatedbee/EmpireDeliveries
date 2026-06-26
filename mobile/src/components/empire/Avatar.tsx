import React, { useState } from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { T, Fonts } from '@/constants/colors';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  ring?: boolean;
  className?: string;
}

const sizeDimensions: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 64,
};

const sizeTextClasses: Record<AvatarSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
};

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  ring = false,
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = !!src && !errored;
  const dim = sizeDimensions[size];

  const containerStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    ...(ring
      ? {
          borderWidth: 2,
          borderColor: T.gold,
        }
      : {}),
  };

  return (
    <View
      className="items-center justify-center overflow-hidden"
      style={[{ backgroundColor: T.surface2 }, containerStyle]}
    >
      {showImage ? (
        <Image
          source={{ uri: src }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          accessibilityLabel={alt ?? name ?? 'Avatar'}
          onError={() => setErrored(true)}
          resizeMode="cover"
        />
      ) : (
        <Text
          className={[sizeTextClasses[size]].join(' ')}
          style={{ fontFamily: Fonts.bodyBold, color: T.gold }}
          accessibilityLabel={name}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
