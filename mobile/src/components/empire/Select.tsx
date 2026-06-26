import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { ChevronDownIcon, CheckIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  label,
  helperText,
  error,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

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

      <TouchableOpacity
        activeOpacity={0.75}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className="flex-row items-center h-11 rounded-md px-4"
        style={{
          backgroundColor: T.surface2,
          borderWidth: 1,
          borderColor: error ? T.danger : T.border,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text
          className="flex-1 text-sm"
          style={{ fontFamily: Fonts.body, color: selected ? T.text : T.textTer }}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDownIcon size={16} color={T.textTer} />
      </TouchableOpacity>

      {error ? (
        <Text className="text-xs mt-1.5 ml-0.5" style={{ color: T.danger }}>{error}</Text>
      ) : helperText ? (
        <Text className="text-xs mt-1.5 ml-0.5" style={{ color: T.textTer }}>{helperText}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={() => setOpen(false)}
        >
          <Pressable onPress={() => {}}>
            <SafeAreaView className="rounded-t-3xl" style={{ backgroundColor: T.bg }}>
              <View className="px-5 pt-4 pb-2">
                {label && (
                  <Text
                    className="text-base mb-3"
                    style={{ fontFamily: Fonts.heading, color: T.text }}
                  >
                    {label}
                  </Text>
                )}
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                style={{ maxHeight: 320 }}
                renderItem={({ item }) => {
                  const isSelected = item.value === value;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        onChange?.(item.value);
                        setOpen(false);
                      }}
                      className="flex-row items-center justify-between px-5 py-4"
                      style={{ borderBottomWidth: 1, borderBottomColor: T.border }}
                    >
                      <Text
                        className="text-sm"
                        style={{
                          fontFamily: isSelected ? Fonts.bodyBold : Fonts.body,
                          color: isSelected ? T.gold : T.text,
                        }}
                      >
                        {item.label}
                      </Text>
                      {isSelected && <CheckIcon size={16} color={T.gold} />}
                    </TouchableOpacity>
                  );
                }}
              />

              <View className="h-6" />
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
