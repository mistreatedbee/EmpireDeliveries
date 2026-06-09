import React from 'react';
import { View, StatusBar, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

type BgKey = 'black' | 'white' | 'surface' | 'charcoal';

const bgMap: Record<BgKey, string> = {
  black: Colors.empire.black,
  white: Colors.empire.white,
  surface: Colors.surface[100],
  charcoal: Colors.empire.charcoal,
};

interface ScreenWrapperProps {
  children: React.ReactNode;
  bg?: BgKey;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function ScreenWrapper({ children, bg = 'surface', style, edges = ['top', 'left', 'right'] }: ScreenWrapperProps) {
  const backgroundColor = bgMap[bg];
  const isLight = bg === 'white' || bg === 'surface';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={edges}>
      <StatusBar barStyle={isLight ? 'dark-content' : 'light-content'} backgroundColor={backgroundColor} />
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
