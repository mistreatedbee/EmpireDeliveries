import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { KeyboardWrapper } from '@/components/layout/KeyboardWrapper';
import { Button, Input } from '@/components/ui';
import { useLocationStore } from '@/stores/locationStore';
import { useUIStore } from '@/stores/uiStore';
import { Address } from '@/types/order.types';

type Label = 'home' | 'work' | 'other';

export default function AddAddressScreen() {
  const { addSavedAddress } = useLocationStore();
  const { showToast } = useUIStore();
  const [form, setForm] = useState({ street: '', suburb: '', city: '', province: '', postalCode: '' });
  const [label, setLabel] = useState<Label>('home');
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.street || !form.city) { showToast('Please fill in street and city', 'error'); return; }
    const address: Address = {
      id: Date.now().toString(),
      label,
      ...form,
      formattedAddress: `${form.street}, ${form.suburb}, ${form.city}, ${form.province} ${form.postalCode}`,
      coordinates: { latitude: 0, longitude: 0 },
    };
    addSavedAddress(address);
    showToast('Address saved', 'success');
    router.back();
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
        <Button variant="gold" size="lg" onPress={save} style={{ marginTop: 8 }}>Save Address</Button>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}
