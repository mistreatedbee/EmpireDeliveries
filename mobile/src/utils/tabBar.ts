import { ViewStyle } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export function tabBarStyle(
  insets: EdgeInsets,
  options: { backgroundColor: string; borderColor: string; baseHeight?: number },
): ViewStyle {
  const baseHeight = options.baseHeight ?? 56;
  const bottomInset = Math.max(insets.bottom, 8);
  return {
    backgroundColor: options.backgroundColor,
    borderTopColor: options.borderColor,
    borderTopWidth: 1,
    height: baseHeight + bottomInset,
    paddingBottom: bottomInset,
    paddingTop: 8,
  };
}
