import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import {
  Button,
  Input,
  Card,
  CardBody,
  Skeleton,
} from '@/components/empire';
import { driverService } from '@/services/driver.service';
import { useUIStore } from '@/stores/uiStore';
import { T, Fonts, Radius } from '@/constants/colors';

type VehicleType = 'Bicycle' | 'Motorbike' | 'Car' | 'Bakkie';

const VEHICLE_TYPES: Array<{ type: VehicleType; emoji: string }> = [
  { type: 'Bicycle', emoji: '🚲' },
  { type: 'Motorbike', emoji: '🏍️' },
  { type: 'Car', emoji: '🚗' },
  { type: 'Bakkie', emoji: '🚚' },
];

interface FormState {
  vehicleType: VehicleType;
  make: string;
  model: string;
  year: string;
  registrationPlate: string;
  colour: string;
}

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  registrationPlate?: string;
  colour?: string;
}

// Map legacy profile vehicleType values to our canonical list
function normaliseVehicleType(raw: string | undefined): VehicleType {
  if (!raw) return 'Motorbike';
  const map: Record<string, VehicleType> = {
    bicycle: 'Bicycle',
    bike: 'Bicycle',
    motorbike: 'Motorbike',
    motorcycle: 'Motorbike',
    car: 'Car',
    bakkie: 'Bakkie',
    truck: 'Bakkie',
  };
  return map[raw.toLowerCase()] ?? 'Motorbike';
}

// Attempt to split "Make Model" stored in vehicleMake field
function splitMakeModel(raw: string | undefined): { make: string; model: string } {
  if (!raw) return { make: '', model: '' };
  const parts = raw.trim().split(/\s+/);
  if (parts.length === 1) return { make: parts[0], model: '' };
  return { make: parts[0], model: parts.slice(1).join(' ') };
}

export default function VehicleDetails() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [form, setForm] = useState<FormState>({
    vehicleType: 'Motorbike',
    make: '',
    model: '',
    year: '',
    registrationPlate: '',
    colour: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [initialised, setInitialised] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['driver', 'profile'],
    queryFn: driverService.getProfile,
  });

  useEffect(() => {
    if (profile && !initialised) {
      const { make, model } = splitMakeModel(profile.vehicleMake);
      setForm({
        vehicleType: normaliseVehicleType(profile.vehicleType),
        make,
        model,
        year: '',
        registrationPlate: profile.vehicleReg ?? '',
        colour: '',
      });
      setInitialised(true);
    }
  }, [profile, initialised]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const makeModel = [form.make.trim(), form.model.trim()].filter(Boolean).join(' ');
      return driverService.updateProfile({
        vehicleType: form.vehicleType,
        vehicleMake: makeModel || undefined,
        vehicleReg: form.registrationPlate.trim().toUpperCase() || undefined,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['driver', 'profile'] });
      showToast('Vehicle details saved successfully.', 'success');
      router.back();
    },
    onError: (err: any) => {
      showToast(err?.message ?? 'Could not save vehicle details. Please try again.', 'error');
    },
  });

  function validate(): boolean {
    const next: FormErrors = {};
    const yearNum = parseInt(form.year.trim(), 10);
    if (form.year.trim() && (isNaN(yearNum) || yearNum < 1990 || yearNum > 2026)) {
      next.year = 'Year must be between 1990 and 2026.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    saveMutation.mutate();
  }

  return (
    <SafeAreaView className="flex-1 bg-t-dark" style={{ flex: 1, backgroundColor: T.dark }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-9 h-9 items-center justify-center rounded-full bg-white/10"
        >
          <ArrowLeft size={20} color={T.textOnDark} />
        </TouchableOpacity>
        <Text
          className="text-xl text-white"
          style={{ fontFamily: Fonts.headingExtra }}
        >
          Vehicle Details
        </Text>
      </View>

      {/* Content area */}
      <ScrollView
        className="flex-1 bg-t-surface rounded-t-3xl"
        style={{ flex: 1, backgroundColor: T.surface, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View className="gap-4 mt-2">
            {/* Vehicle type skeleton */}
            <Skeleton height={20} width={120} rounded="md" />
            <View className="flex-row gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={72} rounded="lg" style={{ flex: 1 }} />
              ))}
            </View>
            {/* Field skeletons */}
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={56} rounded="lg" width="100%" />
            <Skeleton height={48} rounded="lg" width="100%" />
          </View>
        ) : (
          <>
            {/* Vehicle type selector */}
            <View className="mb-5">
              <Text
                className="text-t-text text-sm mb-3"
                style={{ fontFamily: 'Inter_500Medium' }}
              >
                Vehicle Type
              </Text>
              <View className="flex-row gap-2">
                {VEHICLE_TYPES.map(({ type, emoji }) => {
                  const selected = form.vehicleType === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setForm((f) => ({ ...f, vehicleType: type }))}
                      activeOpacity={0.75}
                      className={[
                        'flex-1 py-3 items-center justify-center rounded-2xl',
                        selected
                          ? 'bg-t-gold'
                          : 'bg-t-surface2 border border-t-border',
                      ].join(' ')}
                    >
                      <Text className="text-xl mb-1">{emoji}</Text>
                      <Text
                        className={[
                          'text-xs',
                          selected ? 'text-white' : 'text-t-textSec',
                        ].join(' ')}
                        style={{
                          fontFamily: selected ? 'Inter_700Bold' : 'Inter_400Regular',
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Make */}
            <Input
              label="Make"
              placeholder="e.g. Toyota, Honda, Giant"
              value={form.make}
              onChangeText={(v) => setForm((f) => ({ ...f, make: v }))}
              autoCapitalize="words"
            />

            {/* Model */}
            <Input
              label="Model"
              placeholder="e.g. Corolla, Civic, Escape"
              value={form.model}
              onChangeText={(v) => setForm((f) => ({ ...f, model: v }))}
              autoCapitalize="words"
            />

            {/* Year */}
            <Input
              label="Year"
              placeholder="e.g. 2021"
              value={form.year}
              onChangeText={(v) => {
                setForm((f) => ({ ...f, year: v }));
                setErrors((e) => ({ ...e, year: undefined }));
              }}
              keyboardType="number-pad"
              maxLength={4}
              error={errors.year}
            />

            {/* Registration plate */}
            <Input
              label="Registration Plate"
              placeholder="e.g. CA 123-456"
              value={form.registrationPlate}
              onChangeText={(v) =>
                setForm((f) => ({ ...f, registrationPlate: v.toUpperCase() }))
              }
              autoCapitalize="characters"
              error={errors.registrationPlate}
            />

            {/* Colour */}
            <Input
              label="Colour"
              placeholder="e.g. White, Black, Silver"
              value={form.colour}
              onChangeText={(v) => setForm((f) => ({ ...f, colour: v }))}
              autoCapitalize="words"
            />

            {/* Tip card */}
            <Card className="mb-5 bg-t-surface2">
              <CardBody>
                <Text
                  className="text-t-textSec text-xs"
                  style={{ fontFamily: 'Inter_400Regular' }}
                >
                  Make, Model, Year, and Colour are optional but help customers identify you at pickup.
                </Text>
              </CardBody>
            </Card>

            {/* Save button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={saveMutation.isPending}
              onPress={handleSave}
            >
              Save Vehicle Details
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
