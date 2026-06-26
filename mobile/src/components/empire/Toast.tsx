import React, { useCallback, useState, createContext, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import {
  CheckCircle2Icon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  XIcon,
} from 'lucide-react-native';
import { T, Fonts, Shadows } from '@/constants/colors';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextValue {
  show: (type: ToastType, message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap = {
  success: (size: number) => <CheckCircle2Icon size={size} color={T.success} />,
  error: (size: number) => <XCircleIcon size={size} color={T.danger} />,
  info: (size: number) => <InfoIcon size={size} color={T.info} />,
  warning: (size: number) => <AlertTriangleIcon size={size} color={T.warning} />,
};

export type ToastPosition = 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  duration?: number;
}

function ToastItemView({ item, onRemove }: { item: ToastItem; onRemove: (id: number) => void }) {
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(opacity, { toValue: 1, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: T.glassBorder,
        backgroundColor: T.glass,
        width: 320,
        ...Shadows.md,
      }}
    >
      <View style={{ marginTop: 2 }}>{iconMap[item.type](20)}</View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: Fonts.bodySemibold, color: T.text, fontSize: 14 }}>{item.message}</Text>
        {item.description && (
          <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 12, marginTop: 2 }}>{item.description}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <XIcon size={16} color={T.textSec} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastProvider({ children, position = 'bottom-right', duration = 4000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string, description?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message, description }]);
      setTimeout(() => remove(id), duration);
    },
    [duration, remove]
  );

  const isBottom = position.startsWith('bottom');
  const isCenter = position.endsWith('center');

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toasts.length > 0 && (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            [isBottom ? 'bottom' : 'top']: 60,
            left: 0,
            right: 0,
            alignItems: isCenter ? 'center' : 'flex-end',
            paddingHorizontal: 16,
            zIndex: 9999,
          }}
        >
          {toasts.map((t) => (
            <ToastItemView key={t.id} item={t} onRemove={remove} />
          ))}
        </View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  const { show } = ctx;
  return {
    success: (message: string, description?: string) => show('success', message, description),
    error: (message: string, description?: string) => show('error', message, description),
    info: (message: string, description?: string) => show('info', message, description),
    warning: (message: string, description?: string) => show('warning', message, description),
  };
}
