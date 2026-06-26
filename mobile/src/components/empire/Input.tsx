import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SearchIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'search';
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const icon =
    leftIcon ??
    (variant === 'search' ? (
      <SearchIcon size={16} color={T.textTer} />
    ) : null);

  const borderColor = error ? T.danger : focused ? T.gold : T.border;

  return (
    <View className="w-full mb-4">
      {label && (
        <Text
          className="text-sm mb-1.5"
          style={{ fontFamily: Fonts.bodyMedium, color: T.text }}
        >
          {label}
        </Text>
      )}

      <View
        className={`flex-row rounded-md px-4 ${props.multiline ? 'items-start py-2.5' : 'items-center h-11'}`}
        style={{ backgroundColor: T.surface2, borderWidth: focused || error ? 1.5 : 1, borderColor }}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          className="flex-1 text-sm"
          placeholderTextColor={T.textTer}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={props.multiline ? 'top' : 'center'}
          style={[
            { fontFamily: Fonts.body, color: T.text },
            props.multiline ? { minHeight: 22 * (props.numberOfLines ?? 3) } : null,
            style as object,
          ]}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} className="ml-2">
            {rightIcon}
          </Pressable>
        )}
      </View>

      {error ? (
        <Text className="text-xs mt-1.5 ml-0.5" style={{ color: T.danger }}>{error}</Text>
      ) : helperText ? (
        <Text className="text-xs mt-1.5 ml-0.5" style={{ color: T.textTer }}>{helperText}</Text>
      ) : null}
    </View>
  );
}

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, error = false }: OtpInputProps) {
  const refs = useRef<Array<TextInput | null>>([]);

  const handleChange = (index: number, char: string) => {
    const next = value.split('');
    next[index] = char.slice(-1);
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (char && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-2">
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          keyboardType="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChangeText={(char) => handleChange(i, char)}
          onKeyPress={(e) => handleKeyPress(i, e)}
          className="h-12 w-11 rounded-md text-center text-lg"
          style={{ fontFamily: Fonts.bodySemibold, backgroundColor: T.surface2, color: T.text, borderWidth: error ? 1.5 : 1, borderColor: error ? T.danger : T.border }}
          placeholderTextColor={T.textTer}
          selectionColor={T.gold}
        />
      ))}
    </View>
  );
}
