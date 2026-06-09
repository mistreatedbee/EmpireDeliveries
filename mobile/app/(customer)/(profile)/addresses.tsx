import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLocationStore } from '@/stores/locationStore';
import { Address } from '@/types/order.types';
import { Colors } from '@/constants/colors';

const LABEL_EMOJI: Record<string, string> = { home: '🏠', work: '💼', other: '📍' };

function AddressCard({ address, onDelete }: { address: Address; onDelete: () => void }) {
  return (
    <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F8F8', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{LABEL_EMOJI[address.label]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, textTransform: 'capitalize' }}>{address.label}</Text>
          <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }} numberOfLines={2}>{address.formattedAddress}</Text>
        </View>
        <Pressable onPress={onDelete} style={{ padding: 8 }}>
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AddressesScreen() {
  const { savedAddresses, removeSavedAddress } = useLocationStore();

  return (
    <ScreenWrapper bg="surface">
      <Header title="Saved Addresses" />
      {savedAddresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          subtitle="Save addresses for faster checkout"
          actionLabel="Add Address"
          onAction={() => router.push('/(customer)/(profile)/add-address')}
        />
      ) : (
        <FlatList
          data={savedAddresses}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => <AddressCard address={item} onDelete={() => removeSavedAddress(item.id)} />}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          ListFooterComponent={
            <Button variant="dark" size="md" onPress={() => router.push('/(customer)/(profile)/add-address')}>
              + Add New Address
            </Button>
          }
        />
      )}
    </ScreenWrapper>
  );
}
