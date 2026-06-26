import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Input, Button } from '@/components/empire';
import { T, Fonts } from '@/constants/colors';

const VEHICLE_TYPES = ['Bicycle', 'Motorbike', 'Car', 'Bakkie'] as const;

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

export default function DriverStep2() {
  const params = useLocalSearchParams<Record<string, string>>();

  const [vehicleType, setVehicleType] = useState<string>('Car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [regPlate, setRegPlate] = useState('');
  const [colour, setColour] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!vehicleType) e.vehicleType = 'Please select a vehicle type';
    if (!make.trim()) e.make = 'Vehicle make is required';
    if (!model.trim()) e.model = 'Vehicle model is required';
    const y = parseInt(year, 10);
    if (!year || isNaN(y) || y < 1990 || y > new Date().getFullYear() + 1)
      e.year = 'Please enter a valid year (e.g. 2020)';
    if (!regPlate.trim()) e.regPlate = 'Registration plate is required';
    if (!colour.trim()) e.colour = 'Vehicle colour is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    router.push({
      pathname: '/(auth)/driver-signup/step-3',
      params: {
        ...params,
        vehicleType,
        vehicleMake: make.trim(),
        vehicleModel: model.trim(),
        vehicleYear: year,
        vehicleReg: regPlate.trim().toUpperCase(),
        vehicleColour: colour.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: T.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StepHeader current={2} total={4} title="Vehicle Details" />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontFamily: Fonts.body, color: T.textSec, fontSize: 14, marginBottom: 20 }}>
          Tell us about your delivery vehicle.
        </Text>

        <Text style={{ fontFamily: Fonts.bodyBold, color: T.textTer, fontSize: 12, marginBottom: 10, letterSpacing: 0.5 }}>
          VEHICLE TYPE
        </Text>
        {errors.vehicleType && (
          <Text style={{ fontFamily: Fonts.body, color: T.danger, fontSize: 12, marginBottom: 8 }}>{errors.vehicleType}</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {VEHICLE_TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setVehicleType(t)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: vehicleType === t ? T.gold : T.border,
                backgroundColor: vehicleType === t ? T.goldBg : T.surface,
              }}
            >
              <Text
                style={{
                  fontFamily: Fonts.bodyBold,
                  color: vehicleType === t ? T.goldDeep : T.textSec,
                  fontSize: 13,
                }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Make"
          value={make}
          onChangeText={setMake}
          placeholder="e.g. Toyota"
          autoCapitalize="words"
          error={errors.make}
        />
        <Input
          label="Model"
          value={model}
          onChangeText={setModel}
          placeholder="e.g. Corolla"
          autoCapitalize="words"
          error={errors.model}
        />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Input
              label="Year"
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              placeholder="2020"
              error={errors.year}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              label="Reg. Plate"
              value={regPlate}
              onChangeText={setRegPlate}
              placeholder="CA 123 456"
              autoCapitalize="characters"
              error={errors.regPlate}
            />
          </View>
        </View>

        <Input
          label="Colour"
          value={colour}
          onChangeText={setColour}
          placeholder="e.g. White"
          autoCapitalize="words"
          error={errors.colour}
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
