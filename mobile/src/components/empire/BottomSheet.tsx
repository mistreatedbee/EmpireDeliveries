import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
  PanResponder,
  Dimensions,
} from 'react-native';
import { T, Fonts, Shadows } from '@/constants/colors';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheet({ open, onClose, title, children, footer }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, stiffness: 320, damping: 32 }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120) {
          onClose();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (!open) return null;

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', opacity: backdropOpacity }}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            transform: [{ translateY }],
            backgroundColor: T.glass,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: SCREEN_HEIGHT * 0.85,
            borderWidth: 1,
            borderColor: T.glassBorder,
            ...Shadows.md,
          }}
        >
          <View {...panResponder.panHandlers} className="items-center pt-3 pb-1">
            <View
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: T.border }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-6">
              {title && (
                <Text className="mb-4 text-xl" style={{ fontFamily: Fonts.heading, color: T.text }}>{title}</Text>
              )}
              {children}
            </View>
          </ScrollView>

          {footer && (
            <View
              className="px-6 py-4"
              style={{ borderTopWidth: 1, borderTopColor: T.border }}
            >
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
