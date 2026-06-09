import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface HeaderAction {
  icon: React.ReactNode;
  onPress: () => void;
  badge?: number;
}

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: HeaderAction;
  onBack?: () => void;
  transparent?: boolean;
}

export function Header({ title, showBack = true, rightAction, onBack, transparent = false }: HeaderProps) {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack ? onBack() : router.back();
  };

  return (
    <View
      className={`flex-row items-center justify-between px-4 py-3 ${transparent ? '' : 'bg-white border-b border-surface-200'}`}
      style={{ minHeight: 52 }}
    >
      <View style={{ width: 40 }}>
        {showBack && (
          <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full bg-surface-100">
            <Text style={{ fontSize: 20, color: '#0A0A0A' }}>←</Text>
          </Pressable>
        )}
      </View>

      {title && (
        <Text className="text-empire-black font-bold text-lg flex-1 text-center" numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={{ width: 40, alignItems: 'flex-end' }}>
        {rightAction && (
          <Pressable onPress={rightAction.onPress} className="w-10 h-10 items-center justify-center rounded-full bg-surface-100">
            {rightAction.icon}
            {rightAction.badge !== undefined && rightAction.badge > 0 && (
              <View className="absolute -top-1 -right-1 bg-gold-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-empire-black text-xs font-bold">{rightAction.badge > 9 ? '9+' : rightAction.badge}</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
