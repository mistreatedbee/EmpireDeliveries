import React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';
import { T, Fonts, Shadows } from '@/constants/colors';

export type CardVariant = 'default' | 'glass';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  interactive?: boolean;
  children?: React.ReactNode;
}

export function Card({
  variant = 'default',
  interactive = false,
  className,
  style,
  children,
  ...props
}: CardProps) {
  const variantStyle =
    variant === 'glass'
      ? { backgroundColor: T.glass, borderWidth: 1, borderColor: T.glassBorder, ...Shadows.md }
      : { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, ...Shadows.sm };

  return (
    <View
      className={['rounded-3xl overflow-hidden', className ?? ''].filter(Boolean).join(' ')}
      style={[variantStyle, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardHeaderProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <View
      className={['px-6 pt-5 pb-3', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardTitleProps extends TextProps {
  children?: React.ReactNode;
}

export function CardTitle({ className, style, children, ...props }: CardTitleProps) {
  return (
    <Text
      className={['text-lg', className ?? ''].filter(Boolean).join(' ')}
      style={[{ fontFamily: Fonts.heading, color: T.text }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export interface CardBodyProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <View
      className={['px-6 py-3', className ?? ''].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardFooterProps extends ViewProps {
  children?: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <View
      className={[
        'px-6 pt-3 pb-5 flex-row items-center gap-3',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </View>
  );
}

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaTrend?: 'up' | 'down';
  icon?: React.ReactNode;
}

export function StatCard({
  label,
  value,
  delta,
  deltaTrend = 'up',
  icon,
}: StatCardProps) {
  return (
    <Card>
      <View className="p-6">
        <View className="flex-row items-start justify-between">
          <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14 }}>
            {label}
          </Text>
          {icon && <View>{icon}</View>}
        </View>

        <Text
          className="mt-2 text-3xl"
          style={{ fontFamily: Fonts.headingExtra, color: T.text }}
        >
          {value}
        </Text>

        {delta && (
          <Text
            className="mt-1 text-xs"
            style={{
              fontFamily: Fonts.bodyMedium,
              color: deltaTrend === 'up' ? T.success : T.danger,
            }}
          >
            {deltaTrend === 'up' ? '▲' : '▼'} {delta}
          </Text>
        )}
      </View>
    </Card>
  );
}
