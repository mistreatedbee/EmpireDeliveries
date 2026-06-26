import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Input, Button } from '@/components/empire';
import { T, Fonts } from '@/constants/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type Day = (typeof DAYS)[number];

interface DaySchedule {
  open: boolean;
  openTime: string;
  closeTime: string;
}

const DEFAULT_SCHEDULE: Record<Day, DaySchedule> = {
  Mon: { open: true, openTime: '08:00', closeTime: '22:00' },
  Tue: { open: true, openTime: '08:00', closeTime: '22:00' },
  Wed: { open: true, openTime: '08:00', closeTime: '22:00' },
  Thu: { open: true, openTime: '08:00', closeTime: '22:00' },
  Fri: { open: true, openTime: '08:00', closeTime: '23:00' },
  Sat: { open: true, openTime: '09:00', closeTime: '23:00' },
  Sun: { open: false, openTime: '10:00', closeTime: '21:00' },
};

function StepHeader({ current, total, title }: { current: number; total: number; title: string }) {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} color={T.text} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < current ? T.gold : T.border }}
            />
          ))}
        </View>
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12 }}>
          {current}/{total}
        </Text>
      </View>
      <Text style={{ fontFamily: Fonts.headingExtra, color: T.text, fontSize: 24 }}>{title}</Text>
    </View>
  );
}

function TimeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [raw, setRaw] = useState(value);

  const handleChange = (text: string) => {
    // Allow typing HH:MM format
    const digits = text.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }
    setRaw(formatted);
    // Validate on blur is handled separately; update parent on every change
    onChange(formatted);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontFamily: Fonts.bodySemibold, color: T.textSec, fontSize: 11, marginBottom: 4 }}>{label}</Text>
      <Input
        value={raw}
        onChangeText={handleChange}
        keyboardType="number-pad"
        placeholder="HH:MM"
        style={{ textAlign: 'center', fontSize: 14 }}
      />
    </View>
  );
}

export default function RestaurantStep2() {
  const params = useLocalSearchParams<Record<string, string>>();
  const [schedule, setSchedule] = useState<Record<Day, DaySchedule>>({ ...DEFAULT_SCHEDULE });
  const [minOrder, setMinOrder] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [deliveryRadius, setDeliveryRadius] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDay = (day: Day) => {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], open: !s[day].open } }));
  };

  const updateTime = (day: Day, field: 'openTime' | 'closeTime', value: string) => {
    setSchedule((s) => ({ ...s, [day]: { ...s[day], [field]: value } }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const hasAtLeastOneOpenDay = DAYS.some((d) => schedule[d].open);
    if (!hasAtLeastOneOpenDay) e.schedule = 'Please mark at least one day as open';
    if (!minOrder.trim() || isNaN(Number(minOrder)) || Number(minOrder) < 0)
      e.minOrder = 'Please enter a valid minimum order amount';
    if (!deliveryFee.trim() || isNaN(Number(deliveryFee)) || Number(deliveryFee) < 0)
      e.deliveryFee = 'Please enter a valid delivery fee';
    if (!deliveryRadius.trim() || isNaN(Number(deliveryRadius)) || Number(deliveryRadius) <= 0)
      e.deliveryRadius = 'Please enter a valid delivery radius';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const hoursJson = JSON.stringify(schedule);
    router.push({
      pathname: '/(auth)/restaurant-signup/step-3',
      params: {
        ...params,
        operatingHours: hoursJson,
        minOrder: minOrder.trim(),
        deliveryFee: deliveryFee.trim(),
        deliveryRadius: deliveryRadius.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepHeader current={2} total={4} title="Operating Hours" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 24 }}>
          Set your opening hours and delivery settings.
        </Text>

        {/* Operating Hours */}
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 12, letterSpacing: 0.5 }}>
          OPENING HOURS
        </Text>
        {errors.schedule && (
          <Text style={{ fontFamily: Fonts.body, color: T.danger, fontSize: 12, marginBottom: 10 }}>{errors.schedule}</Text>
        )}

        <View
          style={{
            backgroundColor: T.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: T.border,
            marginBottom: 24,
            overflow: 'hidden',
          }}
        >
          {DAYS.map((day, index) => {
            const entry = schedule[day];
            return (
              <View
                key={day}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: index < DAYS.length - 1 ? 1 : 0,
                  borderBottomColor: T.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: entry.open ? 10 : 0 }}>
                  <Text style={{ fontFamily: Fonts.bodyBold, color: T.text, fontSize: 14, width: 40 }}>{day}</Text>
                  <View style={{ flex: 1 }}>
                    <Switch
                      value={entry.open}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{ false: T.border, true: 'rgba(212,175,55,0.4)' }}
                      thumbColor={entry.open ? T.gold : T.textTer}
                      style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                    />
                  </View>
                  {!entry.open && (
                    <Text style={{ fontFamily: Fonts.body, color: T.textTer, fontSize: 13 }}>Closed</Text>
                  )}
                </View>

                {entry.open && (
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TimeInput
                      label="Opens"
                      value={entry.openTime}
                      onChange={(v) => updateTime(day, 'openTime', v)}
                    />
                    <TimeInput
                      label="Closes"
                      value={entry.closeTime}
                      onChange={(v) => updateTime(day, 'closeTime', v)}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Delivery Settings */}
        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 12, letterSpacing: 0.5 }}>
          DELIVERY SETTINGS
        </Text>

        <Input
          label="Minimum Order Amount (ZAR)"
          value={minOrder}
          onChangeText={setMinOrder}
          keyboardType="decimal-pad"
          placeholder="e.g. 50"
          error={errors.minOrder}
        />

        <Input
          label="Delivery Fee (ZAR)"
          value={deliveryFee}
          onChangeText={setDeliveryFee}
          keyboardType="decimal-pad"
          placeholder="e.g. 25"
          error={errors.deliveryFee}
        />

        <Input
          label="Delivery Radius (km)"
          value={deliveryRadius}
          onChangeText={setDeliveryRadius}
          keyboardType="decimal-pad"
          placeholder="e.g. 10"
          error={errors.deliveryRadius}
        />

        <View style={{ marginTop: 8 }}>
          <Button onPress={handleNext} size="lg">
            Next
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
