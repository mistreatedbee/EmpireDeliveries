import React from 'react';
import { View, Text } from 'react-native';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, maxStars = 5, size = 14, showValue = false }: StarRatingProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Text key={i} style={{ fontSize: size, color: i < Math.floor(rating) ? '#D4AF37' : '#E8E8E8' }}>★</Text>
      ))}
      {showValue && (
        <Text style={{ fontSize: size - 2, color: '#1C1C1C', fontWeight: '600', marginLeft: 4 }}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
