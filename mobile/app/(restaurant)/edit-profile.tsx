import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react-native';
import {
  Button,
  Input,
  Skeleton,
  Card,
  CardBody,
} from '@/components/empire';
import { restaurantManagementService } from '@/services/restaurant-management.service';
import { useUIStore } from '@/stores/uiStore';

interface FormState {
  name: string;
  address: string;
  deliveryFee: string;
  minOrder: string;
}

interface FormErrors {
  name?: string;
  deliveryFee?: string;
  minOrder?: string;
}

export default function EditRestaurantProfile() {
  const queryClient = useQueryClient();
  const showToast = useUIStore((s) => s.showToast);

  const [form, setForm] = useState<FormState>({
    name: '',
    address: '',
    deliveryFee: '',
    minOrder: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [initialised, setInitialised] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['restaurant', 'profile'],
    queryFn: restaurantManagementService.getProfile,
  });

  useEffect(() => {
    if (profile && !initialised) {
      setForm({
        name: profile.name ?? '',
        address: profile.address ?? '',
        deliveryFee: profile.deliveryFee != null ? String(profile.deliveryFee) : '',
        minOrder: profile.minOrder != null ? String(profile.minOrder) : '',
      });
      setInitialised(true);
    }
  }, [profile, initialised]);

  const saveMutation = useMutation({
    mutationFn: () =>
      restaurantManagementService.updateProfile({
        name: form.name.trim(),
        address: form.address.trim(),
        deliveryFee: parseFloat(form.deliveryFee) || 0,
        minOrder: parseFloat(form.minOrder) || 0,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['restaurant', 'profile'] });
      showToast('Profile updated successfully.', 'success');
      router.back();
    },
    onError: (err: any) => {
      showToast(err?.message ?? 'Failed to update profile. Please try again.', 'error');
    },
  });

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'Restaurant name is required.';
    if (form.deliveryFee !== '') {
      const fee = parseFloat(form.deliveryFee);
      if (isNaN(fee) || fee < 0) next.deliveryFee = 'Delivery fee must be a valid non-negative number.';
    }
    if (form.minOrder !== '') {
      const min = parseFloat(form.minOrder);
      if (isNaN(min) || min < 0) next.minOrder = 'Minimum order must be a valid non-negative number.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    saveMutation.mutate();
  }

  return (
    <SafeAreaView className="flex-1 bg-t-dark">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-9 h-9 items-center justify-center rounded-full bg-white/10"
        >
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-xl text-white" style={{ fontFamily: 'Inter_900Black' }}>
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 bg-t-surface rounded-t-3xl"
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <View className="gap-4 mt-2">
              <Skeleton height={56} rounded="lg" width="100%" />
              <Skeleton height={56} rounded="lg" width="100%" />
              <View className="flex-row gap-3">
                <Skeleton height={56} rounded="lg" style={{ flex: 1 }} />
                <Skeleton height={56} rounded="lg" style={{ flex: 1 }} />
              </View>
              <Skeleton height={48} rounded="lg" width="100%" />
            </View>
          ) : (
            <>
              <Card className="mb-5 bg-t-surface2">
                <CardBody>
                  <Text
                    className="text-t-textSec text-xs"
                    style={{ fontFamily: 'Inter_400Regular' }}
                  >
                    Changes to your restaurant name and address may be reviewed before going live.
                  </Text>
                </CardBody>
              </Card>

              <Input
                label="Restaurant Name"
                placeholder="e.g. Empire Burgers"
                value={form.name}
                onChangeText={(v) => {
                  setForm((f) => ({ ...f, name: v }));
                  setErrors((e) => ({ ...e, name: undefined }));
                }}
                autoCapitalize="words"
                error={errors.name}
              />

              <Input
                label="Address"
                placeholder="e.g. 12 Main St, Sandton"
                value={form.address}
                onChangeText={(v) => setForm((f) => ({ ...f, address: v }))}
                autoCapitalize="words"
              />

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="Delivery Fee (R)"
                    placeholder="e.g. 35"
                    value={form.deliveryFee}
                    onChangeText={(v) => {
                      setForm((f) => ({ ...f, deliveryFee: v }));
                      setErrors((e) => ({ ...e, deliveryFee: undefined }));
                    }}
                    keyboardType="decimal-pad"
                    error={errors.deliveryFee}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Min Order (R)"
                    placeholder="e.g. 100"
                    value={form.minOrder}
                    onChangeText={(v) => {
                      setForm((f) => ({ ...f, minOrder: v }));
                      setErrors((e) => ({ ...e, minOrder: undefined }));
                    }}
                    keyboardType="decimal-pad"
                    error={errors.minOrder}
                  />
                </View>
              </View>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={saveMutation.isPending}
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
