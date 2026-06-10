import React from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { userService, BackendAddress } from '@/services/user.service';
import { queryKeys } from '@/constants/queryKeys';
import { useUIStore } from '@/stores/uiStore';
import { Colors } from '@/constants/colors';

const LABEL_EMOJI: Record<string, string> = { home: '🏠', work: '💼', other: '📍' };

function AddressCard({ address, onDelete }: { address: BackendAddress; onDelete: () => void }) {
  const parts = [address.street, address.suburb, address.city, address.province].filter(Boolean);
  return (
    <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8F8F8', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{LABEL_EMOJI[address.label] ?? '📍'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, textTransform: 'capitalize' }}>{address.label}</Text>
          <Text style={{ color: '#666', fontSize: 13, marginTop: 2 }} numberOfLines={2}>{parts.join(', ')}</Text>
          {address.isDefault && (
            <View style={{ marginTop: 4, backgroundColor: Colors.gold[100], borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' }}>
              <Text style={{ color: Colors.gold[700], fontSize: 11, fontWeight: '700' }}>Default</Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => Alert.alert('Delete Address', 'Remove this address?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: onDelete },
          ])}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function AddressesScreen() {
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: queryKeys.user.addresses,
    queryFn: () => userService.getAddresses(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses });
      showToast('Address removed', 'success');
    },
    onError: () => showToast('Failed to remove address', 'error'),
  });

  if (isLoading) {
    return (
      <ScreenWrapper bg="surface">
        <Header title="Saved Addresses" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[500]} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="surface">
      <Header title="Saved Addresses" />
      {addresses.length === 0 ? (
        <EmptyState
          title="No saved addresses"
          subtitle="Save addresses for faster checkout"
          actionLabel="Add Address"
          onAction={() => router.push('/(customer)/(profile)/add-address')}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
          )}
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
