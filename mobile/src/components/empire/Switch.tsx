import React, { useState } from 'react';
import {
  View,
  Text,
  Switch as RNSwitch,
  TouchableOpacity,
} from 'react-native';
import { T, Fonts } from '@/constants/colors';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
}

export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const value = isControlled ? checked! : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggle}
      disabled={disabled}
      className={[
        'flex-row items-center gap-2.5',
        disabled ? 'opacity-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <RNSwitch
        value={value}
        onValueChange={toggle}
        disabled={disabled}
        trackColor={{
          false: T.surface2,
          true: T.gold,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={T.surface2}
      />
      {label != null && (
        <Text
          className="text-sm flex-1"
          style={{ fontFamily: Fonts.body, color: T.text }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
