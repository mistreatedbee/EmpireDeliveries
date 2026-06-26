import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { CheckIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ label, checked, defaultChecked = false, onChange, disabled }: CheckboxProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      disabled={disabled}
      activeOpacity={0.7}
      className="flex-row items-center gap-2.5"
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <View
        className="h-5 w-5 items-center justify-center rounded-md"
        style={{
          borderWidth: 1.5,
          borderColor: isChecked ? T.gold : T.border,
          backgroundColor: isChecked ? T.gold : T.surface2,
        }}
      >
        {isChecked && (
          <CheckIcon size={12} color={T.goldForeground} strokeWidth={3} />
        )}
      </View>

      {label && (
        <Text className="text-sm flex-1" style={{ fontFamily: Fonts.body, color: T.text }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
