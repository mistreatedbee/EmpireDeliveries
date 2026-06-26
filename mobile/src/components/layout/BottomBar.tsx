import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { PriceText } from '@/components/ui/PriceText';

interface BottomBarProps {
  label: string;
  price?: number;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  badge?: string;
}

export function BottomBar({ label, price, onPress, loading, disabled, badge }: BottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white border-t border-surface-200 px-4"
      style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
    >
      <Button variant="primary" size="lg" onPress={onPress} loading={loading} disabled={disabled}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text className="text-empire-black font-bold text-base">{label}</Text>
          {price !== undefined && <PriceText amount={price} size="md" />}
          {badge && (
            <View className="bg-empire-black rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-bold">{badge}</Text>
            </View>
          )}
        </View>
      </Button>
    </View>
  );
}
