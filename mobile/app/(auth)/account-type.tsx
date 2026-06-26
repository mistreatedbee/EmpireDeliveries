import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ShoppingBag, Car, Store, ArrowLeft } from 'lucide-react-native';
import { T, Fonts } from '@/constants/colors';

const TYPES = [
  {
    role: 'customer',
    icon: ShoppingBag,
    title: 'Customer',
    description: 'Order food, groceries & more delivered to your door.',
    color: T.info,
  },
  {
    role: 'driver',
    icon: Car,
    title: 'Driver',
    description: 'Earn money delivering orders in your area.',
    color: T.gold,
  },
  {
    role: 'restaurant',
    icon: Store,
    title: 'Restaurant / Store',
    description: 'Sell your products to thousands of customers on Empire.',
    color: T.success,
  },
] as const;

export default function AccountTypeScreen() {
  const handleSelect = (role: 'customer' | 'driver' | 'restaurant') => {
    if (role === 'customer') {
      router.push('/(auth)/register');
    } else if (role === 'driver') {
      router.push('/(auth)/driver-signup/step-1');
    } else {
      router.push('/(auth)/restaurant-signup/step-1');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}>
        <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 30, marginTop: 16, marginBottom: 6 }}>
          Join Empire
        </Text>
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 15, marginBottom: 36 }}>
          Choose how you'd like to use Empire Deliveries.
        </Text>

        {TYPES.map(({ role, icon: Icon, title, description, color }) => (
          <Pressable
            key={role}
            onPress={() => handleSelect(role)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? T.surface2 : T.surface,
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: T.border,
              padding: 22,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 18,
            })}
          >
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: color + '22', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={26} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: Fonts.headingSemibold, color: T.text, fontSize: 17, marginBottom: 4 }}>{title}</Text>
              <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 13, lineHeight: 19 }}>{description}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={{ fontFamily: Fonts.body, color: T.textTer, fontSize: 12, textAlign: 'center', marginTop: 16 }}>
          Already have an account?{' '}
          <Text style={{ fontFamily: Fonts.bodyBold, color: T.gold }} onPress={() => router.replace('/(auth)/login')}>
            Sign in
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}
