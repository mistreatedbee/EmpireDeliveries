import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  ScrollView,
} from 'react-native';
import { XIcon } from 'lucide-react-native';
import { T, Fonts, Shadows } from '@/constants/colors';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, stiffness: 320, damping: 28 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [open]);

  return (
    <RNModal transparent visible={open} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          className="flex-1 items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', opacity }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ scale }],
                width: '100%',
                maxWidth: 480,
                backgroundColor: T.glass,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: T.glassBorder,
                ...Shadows.md,
              }}
            >
              <TouchableOpacity
                onPress={onClose}
                className="absolute right-4 top-4 z-10 p-1"
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <XIcon size={20} color={T.textSec} />
              </TouchableOpacity>

              <ScrollView>
                <View className="p-6">
                  {title && (
                    <Text className="pr-8 text-xl" style={{ fontFamily: Fonts.heading, color: T.text }}>{title}</Text>
                  )}
                  {description && (
                    <Text className="mt-1 text-sm" style={{ fontFamily: Fonts.body, color: T.textSec }}>{description}</Text>
                  )}
                  {children && (
                    <View className="mt-4">{children}</View>
                  )}
                </View>
              </ScrollView>

              {footer && (
                <View
                  className="flex-row justify-end gap-3 px-6 py-4"
                  style={{ borderTopWidth: 1, borderTopColor: T.border }}
                >
                  {footer}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
