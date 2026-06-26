import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MinusIcon, PlusIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
  disabled = false,
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  const btnSize = size === 'sm' ? 32 : 40;
  const iconSize = 16;

  const canDec = !disabled && value > min;
  const canInc = !disabled && value < max;

  return (
    <View className="flex-row items-center gap-2" accessibilityRole="adjustable">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={dec}
        disabled={!canDec}
        accessibilityLabel="Decrease"
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: T.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: canDec ? 1 : 0.4,
        }}
      >
        <MinusIcon size={iconSize} color={T.text} />
      </TouchableOpacity>

      <Text
        className={['min-w-[2ch] text-center', size === 'sm' ? 'text-sm' : 'text-base'].join(' ')}
        style={{ fontFamily: Fonts.bodyBold, color: T.text }}
        accessibilityLiveRegion="polite"
      >
        {value}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={inc}
        disabled={!canInc}
        accessibilityLabel="Increase"
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: btnSize / 2,
          backgroundColor: T.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: canInc ? 1 : 0.4,
        }}
      >
        <PlusIcon size={iconSize} color={T.text} />
      </TouchableOpacity>
    </View>
  );
}
