import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { Button, Input } from '@/components/ui';
import { userService } from '@/services/user.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { useLocationStore } from '@/stores/locationStore';
import { Address } from '@/types/order.types';

type Label = 'home' | 'work' | 'other';

export default function AddAddressScreen() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();
  const { setSelectedAddress } = useLocationStore();
  const [form, setForm] = useState({ street: '', suburb: '', city: '', province: '', postalCode: '' });
  const [label, setLabel] = useState<Label>('home');
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: () => userService.createAddress({
      label,
      street: form.street,
      suburb: form.suburb || undefined,
      city: form.city,
      province: form.province || undefined,
      postalCode: form.postalCode || undefined,
    }),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
      // Also sync to location store so checkout can use it immediately
      const formatted: Address = {
        id: saved.id,
        label: label,
        street: saved.street,
        suburb: saved.suburb ?? '',
        city: saved.city,
        province: saved.province ?? '',
        postalCode: saved.postalCode ?? '',
        coordinates: {
          latitude: saved.latitude ?? 0,
          longitude: saved.longitude ?? 0,
        },
        formattedAddress: [saved.street, saved.suburb, saved.city, saved.province].filter(Boolean).join(', '),
      };
      setSelectedAddress(formatted);
      showToast('Address saved', 'success');
      router.back();
    },
    onError: () => showToast('Failed to save address', 'error'),
  });

  const save = () => {
    if (!form.street || !form.city) {
      showToast('Please fill in street and city', 'error');
      return;
    }
    mutation.mutate();
  };

  const labels: Label[] = ['home', 'work', 'other'];

  return (
    <ScreenWrapper bg="surface">
      <Header title="Add Address" />
      <KeyboardWrapper contentStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {labels.map((l) => (
            <View key={l} style={{ flex: 1 }}>
              <Button variant={label === l ? 'dark' : 'outline'} size="sm" fullWidth onPress={() => setLabel(l)}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </Button>
            </View>
          ))}
        </View>
        <Input label="Street Address" value={form.street} onChangeText={set('street')} placeholder="123 Main Street" />
        <Input label="Suburb" value={form.suburb} onChangeText={set('suburb')} placeholder="Sandton" />
        <Input label="City" value={form.city} onChangeText={set('city')} placeholder="Johannesburg" />
        <Input label="Province" value={form.province} onChangeText={set('province')} placeholder="Gauteng" />
        <Input label="Postal Code" value={form.postalCode} onChangeText={set('postalCode')} keyboardType="number-pad" placeholder="2196" />
        <Button variant="gold" size="lg" onPress={save} loading={mutation.isPending} style={{ marginTop: 8 }}>
          Save Address
        </Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
