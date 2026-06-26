import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { CheckIcon } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        className={['flex-row items-start', className ?? '']
          .filter(Boolean)
          .join(' ')}
        style={{ flex: 1 }}
      >
        {steps.map((step, i) => {
          const completed = i < current;
          const active = i === current;
          const isLast = i === steps.length - 1;

          return (
            <View
              key={i}
              className="flex-1 flex-col items-center"
              style={{ minWidth: 64 }}
            >
              {/* Circle + connector row */}
              <View className="w-full flex-row items-center">
                {/* Left connector */}
                {i !== 0 ? (
                  <View
                    className="flex-1 h-0.5"
                    style={{
                      backgroundColor: i <= current ? T.gold : T.border,
                    }}
                  />
                ) : (
                  <View className="flex-1" />
                )}

                {/* Step circle */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: completed
                      ? T.gold
                      : active
                      ? 'transparent'
                      : T.surface2,
                    borderWidth: active ? 2 : 0,
                    borderColor: active ? T.gold : 'transparent',
                  }}
                >
                  {completed ? (
                    <CheckIcon size={16} color={T.goldForeground} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: Fonts.bodyBold,
                        color: active ? T.gold : T.textSec,
                      }}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>

                {/* Right connector */}
                {!isLast ? (
                  <View
                    className="flex-1 h-0.5"
                    style={{
                      backgroundColor: completed ? T.gold : T.border,
                    }}
                  />
                ) : (
                  <View className="flex-1" />
                )}
              </View>

              {/* Label below circle */}
              <View className="mt-2 items-center px-1">
                <Text
                  className="text-xs text-center"
                  style={{
                    fontFamily: active || completed ? Fonts.bodyBold : Fonts.body,
                    color: active || completed ? T.text : T.textSec,
                  }}
                  numberOfLines={2}
                >
                  {step.label}
                </Text>
                {step.description && (
                  <Text
                    className="text-xs text-center text-t-textTer mt-0.5"
                    style={{ fontFamily: Fonts.body }}
                    numberOfLines={1}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
