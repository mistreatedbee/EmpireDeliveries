import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StarIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
}

export function Rating({
  value,
  max = 5,
  size = 18,
  readOnly = true,
  onChange,
  showValue = false,
}: RatingProps) {
  const [pressed, setPressed] = useState<number | null>(null);
  const active = pressed ?? value;

  return (
    <View className="flex-row items-center gap-1.5">
      <View className="flex-row">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i + 1 <= Math.round(active);

          if (readOnly) {
            return (
              <View key={i} style={{ marginHorizontal: 1 }}>
                <StarIcon
                  size={size}
                  color={filled ? T.gold : T.border}
                  fill={filled ? T.gold : 'none'}
                />
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              onPress={() => onChange?.(i + 1)}
              onPressIn={() => setPressed(i + 1)}
              onPressOut={() => setPressed(null)}
              accessibilityLabel={`${i + 1} star${i !== 0 ? 's' : ''}`}
              style={{ marginHorizontal: 1 }}
            >
              <StarIcon
                size={size}
                color={filled ? '#C9A227' : '#E8E8E8'}
                fill={filled ? '#C9A227' : 'none'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {showValue && (
        <Text
          className="text-sm"
          style={{ fontFamily: Fonts.bodyMedium, color: T.textSec }}
        >
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
