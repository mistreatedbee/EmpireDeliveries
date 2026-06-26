import React, { useState, createContext, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { T, Fonts } from '@/constants/colors';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  variant: 'underline' | 'segmented';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'segmented';
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, defaultValue, onValueChange, variant = 'underline', children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value! : internal;

  const setValue = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: current, setValue, variant }}>
      <View className="flex-1">{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  const { variant } = useTabs();

  if (variant === 'segmented') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View
          className="flex-row gap-1 p-1 rounded-full"
          style={{ backgroundColor: T.surface2 }}
        >
          {children}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View
        className="flex-row gap-6"
        style={{ borderBottomWidth: 1, borderBottomColor: T.border }}
      >
        {children}
      </View>
    </ScrollView>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { value: current, setValue, variant } = useTabs();
  const selected = current === value;

  if (variant === 'segmented') {
    return (
      <TouchableOpacity
        onPress={() => setValue(value)}
        className="px-4 py-1.5 rounded-full"
        style={{ backgroundColor: selected ? T.gold : 'transparent' }}
      >
        <Text
          className="text-sm"
          style={{ fontFamily: Fonts.bodySemibold, color: selected ? T.goldForeground : T.textSec }}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => setValue(value)}
      className="pb-3"
      style={{
        borderBottomWidth: 2,
        borderBottomColor: selected ? T.gold : 'transparent',
        marginBottom: -1,
      }}
    >
      <Text
        className="text-sm"
        style={{ fontFamily: Fonts.bodySemibold, color: selected ? T.text : T.textSec }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return <View className={`pt-4 ${className ?? ''}`}>{children}</View>;
}
